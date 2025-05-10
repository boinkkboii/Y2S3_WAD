/* eslint-disable prettier/prettier */
// BookingScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getBookingsForUser } from '../services/sqlite';
import { useNavigation } from '@react-navigation/native';

const BookingScreen = () => {
  const [userId, setUserId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('loggedInUserId');
        if (storedUserId) {
          const id = parseInt(storedUserId, 10);
          setUserId(id);

          const db = await getDBConnection();
          const result = await getBookingsForUser(db, id);
          setBookings(result);
        }
      } catch (error) {
        console.error('Error loading user bookings:', error);
      }
    };

    loadBookings();
  }, []);

  return (
    <View style={styles.container}>
      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
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
              <Text style={styles.bookingText}>{item.departure} → {item.destination}</Text>
              <Text>{item.date} at {item.time}</Text>
            </TouchableOpacity>
          )}
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
    padding: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
