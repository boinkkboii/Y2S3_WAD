/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

// needed if you want to use the API data in the app screens
import { getRoutesData } from '../api/routes';        // Import routes API
// import { getAgencyData } from '../api/agency';        // Import agency API
// import { getCalendarData } from '../api/calendar';    // Import calendar API
// import { getStopTimesData } from '../api/stop_times'; // Import stop_times API
// import { getStopsData } from '../api/stops';          // Import stops API
import { getTripsData } from '../api/trips';          // Import trips API

const HomePage = () => {
  const [routes, setRoutes] = useState('');
  // const [agency, setAgency] = useState('');
  // const [calendar, setCalendar] = useState('');
  // const [stopTimes, setStopTimes] = useState('');
  // const [stops, setStops] = useState('');
  const [trips, setTrips] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const routesData = await getRoutesData();
        // const agencyData = await getAgencyData();
        // const calendarData = await getCalendarData();
        // const stopTimesData = await getStopTimesData();
        // const stopsData = await getStopsData();
        const tripsData = await getTripsData();

        setRoutes(routesData);
        // setAgency(agencyData);
        // setCalendar(calendarData);
        // setStopTimes(stopTimesData);
        // setStops(stopsData);
        setTrips(tripsData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>API Data Overview</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Routes Data:</Text>
        <Text style={styles.content}>{routes}</Text>
      </View>

      {/* <View style={styles.section}>
        <Text style={styles.sectionHeader}>Agency Data:</Text>
        <Text style={styles.content}>{agency}</Text>
      </View> */}

      {/* <View style={styles.section}>
        <Text style={styles.sectionHeader}>Calendar Data:</Text>
        <Text style={styles.content}>{calendar}</Text>
      </View> */}

      {/* too many data and caused the app to crash */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionHeader}>Stop Times Data (First 200 entries):</Text>
        <Text style={styles.content}>
          {(() => {
            try {
              const parsed = JSON.parse(stopTimes);
              const sliced = parsed.slice(0, 200);
              return JSON.stringify(sliced, null, 2);
            } catch (e) {
              return stopTimes; // fallback in case parsing fails
            }
          })()}
        </Text>
      </View> */}

      {/* <View style={styles.section}>
        <Text style={styles.sectionHeader}>Stops Data (First 200 entries):</Text>
        <Text style={styles.content}>
          {(() => {
            try {
              const parsed = JSON.parse(stops);
              const sliced = parsed.slice(0, 200);
              return JSON.stringify(sliced, null, 2);
            } catch (e) {
              return stops; // fallback if parsing fails
            }
          })()}
        </Text>
      </View> */}

      {/* <View style={styles.section}>
        <Text style={styles.sectionHeader}>Trips Data (First 200 entries):</Text>
        <Text style={styles.content}>
          {(() => {
            try {
              const parsed = JSON.parse(trips);
              const sliced = parsed.slice(0, 200);
              return JSON.stringify(sliced, null, 2);
            } catch (e) {
              return trips; // fallback if parsing fails
            }
          })()}
        </Text>
      </View> */}

    </ScrollView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  content: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});
