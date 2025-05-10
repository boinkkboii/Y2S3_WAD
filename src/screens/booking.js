import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getBookingsForUser } from '../services/sqlite';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookingScreen = () => {
  const [userId, setUserId] = useState(null);
  const [booking, setBookings] =useState([]);
  const [futureBookings, setFutureBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const loadBookings = async () => {
        const storedUserId = await AsyncStorage.getItem('loggedInUserId');
        if (!storedUserId) {
          Alert.alert('Error', 'Please log in to view your bookings.');
          return;
        }
        setUserId(storedUserId); // Store the logged-in user ID
        try {
          const db = await getDBConnection();
          const result = await getBookingsForUser(db, storedUserId);
          separateBookings(result);
        } catch (error) {
          console.error('Error loading user bookings:', error);
          Alert.alert('Error', 'Failed to load bookings.');
        }
      };

      loadBookings();
    }, [])
  );

  const separateBookings = (bookings) => {
    const now = new Date();
    const future = [];
    const past = [];

    bookings.forEach((b) => {
      if (!b.date || typeof b.date !== 'string') {
        return;
      }

      const [year, month, day] = b.date.split('-').map(Number); // "2025-08-31" -> [2025, 8, 31]
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return;
      }

      const hours = Math.floor(b.time / 100); // 930 -> 9
      const minutes = b.time % 100;           // 930 -> 30
      const bookingDateTime = new Date(year, month - 1, day, hours, minutes); // month - 1 because JS months are 0-based

      if (bookingDateTime.getTime()) {
        if (bookingDateTime >= now) {
          future.push(b);
        } else {
          past.push(b);
        }
      }
    });

    setFutureBookings(future);
    setPastBookings(past);
  };


  const formatTime = (timeInt) => {
    if (typeof timeInt !== 'number') return 'Invalid time';
    const hours = Math.floor(timeInt / 100);
    const minutes = timeInt % 100;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {futureBookings.length > 0 && (
        <View style={styles.bookingsSection}>
          <Text style={styles.sectionTitle}>Future Bookings</Text>
          <FlatList
            data={futureBookings}
            keyExtractor={(item) => item.booking_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('BookingDetail', {
                    bookingId: item.booking_id,
                    userId: userId,
                  })
                }
                style={styles.bookingItem}
              >
                <Text style={styles.bookingText}>
                  {item.departure}{' '}
                  <Icon name="arrow-forward" size={16} color="#b3b1b1" />
                  {' '}{item.destination}
                </Text>
                <Text style={styles.bookingTime}>
                  {item.date}, {formatTime(item.time)}
                </Text>
                <Text style={styles.bookingTime}>Bus - My Bus</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      
      {pastBookings.length > 0 && (
        <View style={styles.bookingsSection}>
          <Text style={styles.sectionTitle}>Past Bookings</Text>
          <FlatList
            data={pastBookings}
            keyExtractor={(item) => item.booking_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('BookingDetail', {
                    bookingId: item.booking_id,
                    userId: userId,
                  })
                }
                style={styles.bookingItem}
              >
                <Text style={styles.bookingText}>
                  {item.departure}{' '}
                  <Icon name="arrow-forward" size={16} color="#b3b1b1" />
                  {' '}{item.destination}
                </Text>
                <Text style={styles.bookingTime}>
                  {item.date}, {formatTime(item.time)}
                </Text>
                <Text style={styles.bookingTime}>Bus - My Bus</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: '#f4f4f4',
  },
  bookingsSection: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookingItem: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingText: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
    color: '#000',
  },
  bookingTime: {
    fontFamily: 'Nunito',
    color: '#000',
    fontSize: 14,
  },
});

export default BookingScreen;
