// BookingScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getDBConnection, getBookingsForUser } from '../services/sqlite';
import { useNavigation } from '@react-navigation/native';

const BookingScreen = ({ route }) => {
  const userId = 1; // Passed from the tab or login context
  const [bookings, setBookings] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadBookings = async () => {
      const db = await getDBConnection();
      const result = await getBookingsForUser(db, userId);
      setBookings(result);
    };

    loadBookings();
  }, [userId]);

  return (
    <View style={styles.container}>
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
            <Text style={styles.bookingText}>{item.from_location} → {item.to_location}</Text>
            <Text>{item.date} at {item.time}</Text>
          </TouchableOpacity>
        )}
      />
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
