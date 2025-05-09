// BookingDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getBookingDetailsById } from '../services/sqlite';

const BookingDetailScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const [booking, setBookingDetails] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
      const loadDetails = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('loggedInUserId');
          if (!storedUserId) return;
  
          const id = parseInt(storedUserId, 10);
          setUserId(id);
  
          const db = await getDBConnection();
          const bookingDetails = await getBookingDetailsById(db, bookingId);
  
          if (bookingDetails?.user_id === id) {
            setBookingDetails(bookingDetails);
          } else {
            console.warn('Booking does not belong to this user.');
          }
        } catch (error) {
          console.error('Error loading booking detail:', error);
        }
      };

    loadDetails();
  }, [bookingId]);

  if (!booking) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Booking ID: {booking.booking_id}</Text>
      <Text>From: {booking.departure}</Text>
      <Text>To: {booking.destination}</Text>
      <Text>Date: {booking.date}</Text>
      <Text>Time: {booking.time}</Text>
      <Text>Passengers: {booking.no_of_passenger}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 18,
    marginVertical: 4,
  },
});

export default BookingDetailScreen;
