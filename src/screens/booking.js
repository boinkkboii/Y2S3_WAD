/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Button, PermissionsAndroid, Platform} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import getCoordinates from '../api/getCoordinates';
import getWeather from '../api/getWeather';

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'We need your permission to show your location on the map.',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

const BookingScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [startStopCoords, setStartStopCoords] = useState(null);
  const [endStopCoords, setEndStopCoords] = useState(null);
  const [startWeather, setStartWeather] = useState('');
  const [endWeather, setEndWeather] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startStopName = 'KSL City Mall Bus Stop, Johor Bahru, Malaysia';
  const endStopName = 'JB Sentral Bus Terminal, Johor Bahru, Malaysia';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const permissionGranted = await requestLocationPermission();
      if (!permissionGranted) {
        setError('Location permission denied.');
        setLoading(false);
        return;
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });

            const startCoords = await getCoordinates(startStopName);
            const endCoords = await getCoordinates(endStopName);

            if (!startCoords?.latitude || !endCoords?.latitude) {
              throw new Error('Invalid bus stop coordinates');
            }

            setStartStopCoords(startCoords);
            setEndStopCoords(endCoords);

            const startWeatherDesc = await getWeather(startCoords.latitude, startCoords.longitude);
            const endWeatherDesc = await getWeather(endCoords.latitude, endCoords.longitude);

            setStartWeather(startWeatherDesc);
            setEndWeather(endWeatherDesc);
          } catch (err) {
            console.error('Data error:', err);
            setError('Could not fetch map or weather data.');
          } finally {
            setLoading(false);
          }
        },
        (geoError) => {
          console.error('Geolocation error:', geoError);
          setError('Could not fetch your location. Check location services.');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
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

      {userLocation && startStopCoords && endStopCoords && (
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
          <Marker
            coordinate={startStopCoords}
            title="Start: KSL City"
            description={`Weather: ${startWeather}`}
          />
          <Marker
            coordinate={endStopCoords}
            title="End: JB Sentral"
            description={`Weather: ${endWeather}`}
          />
          <Polyline
            coordinates={[startStopCoords, endStopCoords]}
            strokeColor="#000"
            strokeWidth={3}
          />
        </MapView>
      )}

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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
