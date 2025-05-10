/* eslint-disable prettier/prettier */
// BookingDetailScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getBookingDetailsById, updateBooking, deleteBooking } from '../services/sqlite';
import MapView, { Marker, Polyline } from 'react-native-maps';
import getCoordinates from '../api/getCoordinates'; // Adjust if needed
import getWeather from '../api/getWeather';

const BookingDetailScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const [booking, setBookingDetails] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedPassengers, setUpdatedPassengers] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const mapRef = useRef(null);
  const [weather, setWeather] = useState(null);

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
          
          // Fetch coordinates
          if (bookingDetails.departure && bookingDetails.destination) {
              const fromCoords = await getCoordinates(bookingDetails.departure);
              const toCoords = await getCoordinates(bookingDetails.destination);
              setCoordinates({ from: fromCoords, to: toCoords });

              // Fetch weather at the destination
              if (toCoords?.latitude && toCoords?.longitude) {
                const weatherStatus = await getWeather(toCoords.latitude, toCoords.longitude);
                setWeather(weatherStatus);
              }

              // Fit both markers on screen
              setTimeout(() => {
                if (mapRef.current && fromCoords && toCoords) {
                  mapRef.current.fitToCoordinates(
                    [fromCoords, toCoords],
                    { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true }
                  );
                }
              }, 500);
            }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafe' }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {coordinates && (
        <View style={{ height: 250, marginBottom: 16, borderRadius: 10, overflow: 'hidden' }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            initialRegion={{
              latitude: coordinates.from.latitude,
              longitude: coordinates.from.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker coordinate={coordinates.from} title="From" />
            <Marker coordinate={coordinates.to} title="To" />
            <Polyline
              coordinates={[coordinates.from, coordinates.to]}
              strokeColor="#3a86ff"
              strokeWidth={3}
            />
          </MapView>
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>Booking ID: <Text style={styles.value}>{booking.booking_id}</Text></Text>
        <Text style={styles.label}>From: <Text style={styles.value}>{booking.departure}</Text></Text>
        <Text style={styles.label}>To: <Text style={styles.value}>{booking.destination}</Text></Text>
        <Text style={styles.label}>Date: <Text style={styles.value}>{booking.date}</Text></Text>
        <Text style={styles.label}>Time: <Text style={styles.value}>{booking.time}</Text></Text>
        <Text style={styles.label}>Price: <Text style={styles.value}>RM {booking.price}</Text></Text>
        <Text style={styles.label}>Passengers: <Text style={styles.value}>{booking.no_of_passenger}</Text></Text>
      </View>
      
      {weather && (
        <View style={styles.weatherCard}>
          <Text style={styles.label}>Weather at Destination:</Text>
          <Text style={styles.weatherValue}>{weather}</Text>
        </View>
      )}

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
    </SafeAreaView>
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
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  weatherCard: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  weatherValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077b6',
    marginTop: 6,
  },
});
