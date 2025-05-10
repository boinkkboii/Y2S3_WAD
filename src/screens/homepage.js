/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
import SQLite from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';

// Enable SQLite debugging if needed
SQLite.enablePromise(true);

const HomePage = () => {
  const [maintenance, setMaintenance] = useState(null);
  const [routes, setRoutes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const socket = io('http://10.0.2.2:5000/maintenance', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to maintenance namespace');
      socket.emit('request_maintenance', { request: true });
    });

    socket.on('maintenance_alert', (data) => {
      console.log('Maintenance Message:', data);
      setMaintenance(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const loadRoutesFromDB = async () => {
      try {
        const db = await SQLite.openDatabase({
          name: 'busApp.sqlite',
          location: 'default',
          createFromLocation: '~busApp.sqlite',
        });

        const [results] = await db.executeSql('SELECT * FROM routes');
        const routeList = [];

        for (let i = 0; i < results.rows.length; i++) {
          routeList.push(results.rows.item(i));
        }

        setRoutes(routeList);
        db.close();
      } catch (error) {
        console.error('Failed to load routes:', error);
      }
    };

    loadRoutesFromDB();
  }, []);

  const handleRoutePress = (route) => {
    navigation.navigate('NewBooking', {
      departure: route.departure,
      destination: route.destination,
    });
  };

  const formatTime = (timeInt) => {
    const timeStr = timeInt.toString().padStart(4, '0'); // e.g., "800" => "0800"
    const hours = timeStr.slice(0, 2);
    const minutes = timeStr.slice(2);
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      {maintenance && (
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>{maintenance.title}</Text>
          <Text style={styles.bannerText}>{maintenance.message}</Text>
        </View>
      )}

      <Text style={styles.title}>Welcome to Bus Booking System</Text>
      <Text style={styles.subtitle}>Available Routes:</Text>

      <FlatList
        data={routes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.routeItem} onPress={() => handleRoutePress(item)}>
            <Text style={styles.routeText}>From: {item.departure}</Text>
            <Text style={styles.routeText}>To: {item.destination}</Text>
            <Text style={styles.routeText}>Time: {formatTime(item.time)}</Text>
            <Text style={styles.routeText}>Duration: {item.duration} mins</Text>
            <Text style={styles.routeText}>Price: RM{item.price}.00</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    margin: 10,
    backgroundColor: '#ffd4d4',
    borderColor: '#fa2f2f',
    borderWidth: 1.5,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  bannerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: "#000"
  },
  bannerText: {
    fontSize: 14,
    color: "#1b204b"
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Nunito',
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    fontFamily: 'Nunito',
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10
  },
  routeItem: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  routeText: {
    fontSize: 14,
    color: '#1b204b'
  },
});

export default HomePage;
