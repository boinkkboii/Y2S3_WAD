/* eslint-disable prettier/prettier */
import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getBookingsForUser } from '../services/sqlite';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatTime } from '../utils/utility';
const BookingScreen = () => {
  const [userId, setUserId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const loadBookings = async () => {
        const storedUserId = await AsyncStorage.getItem('loggedInUserId');
        if (!storedUserId) {
          Alert.alert('Error', 'Please log in to view your bookings.');
          return;
        }
        setUserId(storedUserId);
        try {
          const db = await getDBConnection();
          const result = await getBookingsForUser(db, storedUserId);
          setBookings(result);
        } catch (error) {
          console.error('Error loading user bookings:', error);
          Alert.alert('Error', 'Failed to load bookings.');
        }
      };

      loadBookings();
    }, [])
  );


  return (
    <View style={styles.container}>
      {bookings.length > 0 ? (
        <FlatList 
          data={bookings}
          keyExtractor={(item) => item.booking_id.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('BookingDetail', {
                    bookingId: item.booking_id,
                    userId: userId,
                  })
                }
                style={styles.bookingItem}
              >
                <Text style={styles.bookingText}>{item.departure}{' '}<Icon name="arrow-forward" size={16} color="#8c8c8c" fontWeight='bold' />
                {' '}{item.destination}</Text>
                <Text style={styles.bookingTime}>{item.date}, {formatTime(item.time)}</Text>
                <Text style={styles.bookingTime}>Bus - My Bus</Text>
              </TouchableOpacity>
            );
          }}
          
        />
      ) : (
        <Text>No bookings found.</Text>
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
    color: '#000'
  },
  bookingTime: {
    fontFamily: 'Nunito',
    color: '#000',
    fontSize: 14,
  }
});

export default BookingScreen;
