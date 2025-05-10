/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import io from 'socket.io-client';
import SQLite from 'react-native-sqlite-storage';

// Enable SQLite debugging if needed
SQLite.enablePromise(true);

const HomePage = () => {
  const [maintenance, setMaintenance] = useState(null);
  const [routes, setRoutes] = useState([]);

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
          <View style={styles.routeItem}>
            <Text style={styles.routeText}>From: {item.departure}</Text>
            <Text style={styles.routeText}>To: {item.destination}</Text>
            <Text style={styles.routeText}>Time: {item.time}</Text>
            <Text style={styles.routeText}>Duration: {item.duration} mins</Text>
            <Text style={styles.routeText}>Price: RM{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    backgroundColor: '#fffae6',
    borderColor: '#ffc107',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  bannerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  routeItem: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  routeText: {
    fontSize: 14,
  },
});

export default HomePage;
