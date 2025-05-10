import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getBookingsForUser } from '../services/sqlite';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookingScreen = () => {
  const [userId, setUserId] = useState(null);
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
    const now = new Date(); // Get the current date and time
    const currentYear = now.getFullYear(); // Get the current year dynamically
  
    const future = [];
    const past = [];
  
    bookings.forEach((b) => {
      const dateParts = b.date.split(' ')[1].split('-'); // "14-May" -> ["14", "May"]
      const day = dateParts[0]; // Day is the first part
      const monthName = dateParts[1]; // Month name is the second part
  
      // Map the month name to a month number (0-based index)
      const monthMap = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      };
      const month = monthMap[monthName]; // Get the corresponding month number
  
      // Ensure all values are valid before creating the Date object
      if (!month || isNaN(day)) return; // Skip invalid booking data
  
      const hours = Math.floor(b.time / 100); // Get hours
      const minutes = b.time % 100; // Get minutes
      const bookingDateTime = new Date(currentYear, month, day, hours, minutes); // Use currentYear
  
      // If the booking date is valid, separate into future or past
      if (bookingDateTime.getTime()) {
        if (bookingDateTime >= now) {
          future.push(b); // Future booking
        } else {
          past.push(b); // Past booking
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
