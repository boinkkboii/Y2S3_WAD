/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import getCoordinates from '../api/getCoordinates';
import getWeather from '../api/getWeather';

const BookingScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [startStopCoords, setStartStopCoords] = useState(null);
  const [endStopCoords, setEndStopCoords] = useState(null);
  const [startWeather, setStartWeather] = useState('');
  const [endWeather, setEndWeather] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // State to store error message

  const startStopName = 'KSL City Mall Bus Stop, Johor Bahru, Malaysia';
  const endStopName = 'JB Sentral Bus Terminal, Johor Bahru, Malaysia';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user's current location
        Geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });

            // Fetch coordinates for the start and end bus stops
            const startCoords = await getCoordinates(startStopName);
            const endCoords = await getCoordinates(endStopName);

            setStartStopCoords(startCoords);
            setEndStopCoords(endCoords);

            // Fetch weather information for the start and end bus stops
            const startWeatherDesc = await getWeather(startCoords.latitude, startCoords.longitude);
            const endWeatherDesc = await getWeather(endCoords.latitude, endCoords.longitude);

            setStartWeather(startWeatherDesc);
            setEndWeather(endWeatherDesc);

            setLoading(false);
          },
          (error) => {
            // Handle error here
            console.error("Geolocation error:", error);  // Log to terminal
            setError('Unable to fetch your location. Please check your permissions or network.');  // Set error state
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      } catch (error) {
        // Handle errors in the try block
        console.error("Error fetching data:", error.message);  // Log to terminal
        setError('An error occurred while fetching data. Please try again later.');  // Set error state
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !userLocation || !startStopCoords || !endStopCoords) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading map and weather data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Try Again" onPress={() => setError(null)} />
        </View>
      )}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={userLocation} title="Your Location" />
        <Marker coordinate={startStopCoords} title="Start: KSL City" description={`Weather: ${startWeather}`} />
        <Marker coordinate={endStopCoords} title="End: JB Sentral Bus Terminal" description={`Weather: ${endWeather}`} />
        <Polyline
          coordinates={[startStopCoords, endStopCoords]}
          strokeColor="#000"
          strokeWidth={3}
        />
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Start Location: KSL City Mall</Text>
        <Text style={styles.infoText}>Weather: {startWeather}</Text>
        <Text style={styles.infoText}>End Location: JB Sentral</Text>
        <Text style={styles.infoText}>Weather: {endWeather}</Text>
      </View>
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 2,
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  errorText: {
    color: '#721c24',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

