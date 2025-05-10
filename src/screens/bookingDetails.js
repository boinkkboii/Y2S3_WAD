/* eslint-disable prettier/prettier */
// BookingDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getBookingDetailsById, updateBooking, deleteBooking } from '../services/sqlite';

const BookingDetailScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const [booking, setBookingDetails] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedPassengers, setUpdatedPassengers] = useState('');

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

  const handleEditPassengers = async () => {
    const count = parseInt(updatedPassengers);
    if (isNaN(count) || count < 1) {
      Alert.alert('Invalid number');
      return;
    }

    try {
      const db = await getDBConnection();
      await updateBooking(db, bookingId, count);
      setBookingDetails((prev) => ({
        ...prev,
        no_of_passenger: count,
      }));
      setShowEditModal(false);
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this booking?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const db = await getDBConnection();
            await deleteBooking(db, bookingId);
            Alert.alert('Booking deleted.');
            navigation.goBack();
          } catch (err) {
            console.error('Delete failed:', err);
          }
        },
      },
    ]);
  };

 return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Booking ID: <Text style={styles.value}>{booking.booking_id}</Text></Text>
        <Text style={styles.label}>From: <Text style={styles.value}>{booking.departure}</Text></Text>
        <Text style={styles.label}>To: <Text style={styles.value}>{booking.destination}</Text></Text>
        <Text style={styles.label}>Date: <Text style={styles.value}>{booking.date}</Text></Text>
        <Text style={styles.label}>Time: <Text style={styles.value}>{booking.time}</Text></Text>
        <Text style={styles.label}>Price: <Text style={styles.value}>RM {booking.price}</Text></Text>
        <Text style={styles.label}>Passengers: <Text style={styles.value}>{booking.no_of_passenger}</Text></Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setShowPaymentModal(true)}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#FFA500' }]} onPress={() => {
        setUpdatedPassengers(String(booking.no_of_passenger));
        setShowEditModal(true);
      }}>
        <Text style={styles.buttonText}>Edit Passengers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4d4d' }]} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Booking</Text>
      </TouchableOpacity>

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Payment Method</Text>
            {['UPI', 'Credit/Debit Card', 'Cash on Boarding'].map((option) => (
              <TouchableOpacity key={option} style={styles.modalButton} onPress={() => {
                Alert.alert('Payment selected', `You chose: ${option}`);
                setShowPaymentModal(false);
              }}>
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowPaymentModal(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Passengers</Text>
            <TextInput
              value={updatedPassengers}
              onChangeText={setUpdatedPassengers}
              keyboardType="numeric"
              style={styles.input}
            />
            <TouchableOpacity onPress={handleEditPassengers} style={styles.modalButton}>
              <Text>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowEditModal(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default BookingDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafe',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  value: {
    fontWeight: 'normal',
  },
  button: {
    backgroundColor: '#3a86ff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    width: '100%',
    alignItems: 'center',
    borderRadius: 6,
    marginVertical: 5,
  },
  modalClose: {
    marginTop: 10,
  },
  modalCloseText: {
    color: '#ff3333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
});
