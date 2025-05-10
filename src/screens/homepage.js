/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// import React, { useEffect, useState } from 'react';
// import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
// import { io } from 'socket.io-client';  // Import socket.io-client

// // needed if you want to use the API data in the app screens
// import { getRoutesData } from '../api/routes';        // Import routes API
// // import { getAgencyData } from '../api/agency';        // Import agency API
// // import { getCalendarData } from '../api/calendar';    // Import calendar API
// // import { getStopTimesData } from '../api/stop_times'; // Import stop_times API
// // import { getStopsData } from '../api/stops';          // Import stops API
// import { getTripsData } from '../api/trips';          // Import trips API

// const HomePage = () => {
//   const [routes, setRoutes] = useState('');
//   // const [agency, setAgency] = useState('');
//   // const [calendar, setCalendar] = useState('');
//   // const [stopTimes, setStopTimes] = useState('');
//   // const [stops, setStops] = useState('');
//   const [trips, setTrips] = useState('');
//   const [loading, setLoading] = useState(true);

//   // Socket.IO state
//   const [realTimeLocation, setRealTimeLocation] = useState(null);  // State for real-time location updates

//   // Connect to the Socket.IO server
//   const socket = io('http://localhost:5000');  // Connect to the server (adjust to your server URL)

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         setLoading(true);
//         const routesData = await getRoutesData();
//         // const agencyData = await getAgencyData();
//         // const calendarData = await getCalendarData();
//         // const stopTimesData = await getStopTimesData();
//         // const stopsData = await getStopsData();
//         const tripsData = await getTripsData();

//         setRoutes(routesData);
//         // setAgency(agencyData);
//         // setCalendar(calendarData);
//         // setStopTimes(stopTimesData);
//         // setStops(stopsData);
//         setTrips(tripsData);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();

//     // Listen for real-time location updates from the server
//     socket.on('location_update', (data) => {
//       console.log('Real-time location update:', data);
//       setRealTimeLocation(data);  // Update state with the received data
//     });

//     // Cleanup: Disconnect socket when the component is unmounted
//     return () => {
//       socket.off('location_update');
//     };
//   }, []);

//   // Send location data to the server (this is just an example, you can trigger this based on user input or other events)
//   const sendLocation = () => {
//     const location = { lat: 1.4965, lng: 103.7637 };  // Dummy location (can be dynamic)

//     socket.emit('send_location', location);  // Emit location to the server
//     console.log('Location sent:', location);
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading data...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>API Data Overview</Text>

//       <View style={styles.section}>
//         <Text style={styles.sectionHeader}>Routes Data:</Text>
//         <Text style={styles.content}>{routes}</Text>
//       </View>

//       {/* Button to send a test location to the server */}
//       <View style={styles.section}>
//         <Text onPress={sendLocation} style={styles.button}>
//           Send Location to Server
//         </Text>
//       </View>

//       {/* Display real-time location updates */}
//       {realTimeLocation && (
//         <View style={styles.section}>
//           <Text style={styles.sectionHeader}>Real-time Location Update:</Text>
//           <Text style={styles.content}>
//             Lat: {realTimeLocation.lat}, Lng: {realTimeLocation.lng}
//           </Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// export default HomePage;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#2c3e50',
//   },
//   content: {
//     fontSize: 14,
//     color: '#7f8c8d',
//   },
//   button: {
//     backgroundColor: '#3498db',
//     color: '#fff',
//     padding: 10,
//     textAlign: 'center',
//     borderRadius: 5,
//   },
// });

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import io from 'socket.io-client';

const HomePage = () => {
  const [maintenance, setMaintenance] = useState(null);

  useEffect(() => {
    const socket = io('http://10.0.2.2:5000/maintenance', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to maintenance namespace');
      socket.emit('request_maintenance', { request: true }); // Optional
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

  return (
    <View style={styles.container}>
      {maintenance && (
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>{maintenance.title}</Text>
          <Text style={styles.bannerText}>{maintenance.message}</Text>
        </View>
      )}

      <Text style={styles.title}>Welcome to Bus Booking System</Text>
      {/* Other home content */}
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
  },
});

export default HomePage;

