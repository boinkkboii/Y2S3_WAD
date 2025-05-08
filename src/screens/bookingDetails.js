// BookingDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getDBConnection, getBookingDetailsById } from '../services/sqlite';

const BookingDetailScreen = ({ route }) => {
  const { bookingId, userId } = route.params;
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      const db = await getDBConnection();
      const result = await getBookingDetailsById(db, bookingId, userId);
      setBookingDetails(result);
    };

    loadDetails();
  }, [bookingId, userId]);

  if (!bookingDetails) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{bookingDetails.from_location} → {bookingDetails.to_location}</Text>
      <Text style={styles.detailText}>Date: {bookingDetails.date}</Text>
      <Text style={styles.detailText}>Time: {bookingDetails.time}</Text>
      <Text style={styles.detailText}>Bus Plate: {bookingDetails.car_plate}</Text>
      <Text style={styles.detailText}>Driver: {bookingDetails.driver_name}</Text>
      <Text style={styles.detailText}>Bus Type: {bookingDetails.bus_type}</Text>
      <Text style={styles.detailText}>Passengers: {bookingDetails.no_of_passenger}</Text>
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
