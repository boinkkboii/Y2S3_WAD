/* eslint-disable prettier/prettier */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableField, SegmentedButtons, SearchButton } from '../utils/UI';
import { getDBConnection, getBusStops, getRoutes } from '../services/sqlite';
import { formatted } from '../utils/utility';
import { createBooking } from '../services/sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NewBookingScreen = ({ route }) => {
  const { departure, destination } = route.params || {};
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date());
  const [dateOption, setDateOption] = useState('Today');
  const [returnDate, setReturnDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [stops, setStops] = useState([]);
  const [routesData, setRoutesData] = useState([]);
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showTimesModal, setShowTimesModal] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [noOfPassengers, setNoOfPassengers] = useState('1');
  const [userId, setUserId] = useState(null);
  

  useFocusEffect(
    useCallback(() => {
      const fetchStopsAndRoutes = async () => {
        try {
          const db = await getDBConnection();

          // Fetch and set bus stops
          const stopsData = await getBusStops(db);
          const stopNames = stopsData
            .map((stop) => stop.name)
            .filter((name) => typeof name === 'string' && name.trim() !== '');
          const uniqueStops = Array.from(new Set(stopNames)).sort();
          setStops(uniqueStops);

          // Fetch and set route data
          const routes = await getRoutes(db);
          setRoutesData(routes);

          // Fetch and set user
          const storedUserId = await AsyncStorage.getItem('loggedInUserId');
          setUserId(storedUserId);

          // Set departure and destination if passed from home
          if (departure) setFrom(departure);
          if (destination) setTo(destination);
        } catch (error) {
          console.error('Error loading routes or user:', error);
        }
      };

      fetchStopsAndRoutes();
    }, [departure, destination])
  );

  const onSelectDateOption = (opt) => {
    setDateOption(opt);
    const today = new Date();
    if (opt === 'Today') setDate(today);
    else if (opt === 'Tomorrow') {
      today.setDate(today.getDate() + 1);
      setDate(today);
    }
  };

  const handleRouteSelect = (stop) => {
    if (selectedField === 'from') setFrom(stop);
    else if (selectedField === 'to') setTo(stop);
    setShowCityModal(false);
  };
  
  const filteredStops = stops
    .filter((stop) => stop.toLowerCase().includes(searchText.toLowerCase()))
    .map((stop) => ({ stop_name: stop }));

  const validateRoute = () => {
    if (from && to) {
      const fromStop = stops.find((stop) => stop === from);
      const toStop = stops.find((stop) => stop === to);

      if (!fromStop || !toStop) {
        Alert.alert('Invalid stops', 'Please make sure both "From" and "To" stops are selected correctly.');
        return;
      }

      const routeFound = routesData.some(
        (route) =>
          route.departure.toLowerCase() === from.toLowerCase() &&
          route.destination.toLowerCase() === to.toLowerCase()
      );

      const returnTripFound = returnDate
        ? routesData.some(
            (route) =>
              route.departure.toLowerCase() === to.toLowerCase() &&
              route.destination.toLowerCase() === from.toLowerCase()
          )
        : true;

      if (!routeFound) {
        Alert.alert('Route not found', 'No available route between the selected stops.');
      } else if (!returnTripFound) {
        Alert.alert('Return route not found', 'No available return route between the selected stops.');
      } else {
        const normalize = (s) => s?.trim().toLowerCase();
        const matchingTrips = routesData.filter(
          (route) =>
            normalize(route.departure) === normalize(from) &&
            normalize(route.destination) === normalize(to)
        );
        const outboundWithTimes = matchingTrips.map((route) => ({
          id: route.route_id,
          departure: route.departure,
          destination: route.destination,
          departure_time: route.time,
          duration: route.duration,
        }));
        setAvailableTimes(outboundWithTimes);
        setShowTimesModal(true);
      }
    }
  };

  const handleCreateBooking = (route_id) => {
    if (!userId) {
      Alert.alert('User not logged in');
      return;
    }

  const passengerCount = parseInt(noOfPassengers);
    if (isNaN(passengerCount) || passengerCount < 1) {
      Alert.alert('Invalid passenger count', 'Please enter a valid number.');
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Book ${passengerCount} passenger(s) from ${from} to ${to}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const db = await getDBConnection();
              await createBooking(db, userId, route_id, passengerCount, formatted(date));
              setShowTimesModal(false);
              Alert.alert('Success', 'Booking created successfully!');
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Failed to create booking.');
            }
          },
        },
      ]
    );
  };

  const formatTime = (timeInt) => {
    const timeStr = timeInt.toString().padStart(4, '0'); // e.g., "800" => "0800"
    const hours = timeStr.slice(0, 2);
    const minutes = timeStr.slice(2);
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bus Tickets</Text>
      <View style={styles.card}>
        <TouchableField
          icon="bus"
          label="From : "
          value={from}
          onPress={() => {
            setSelectedField('from');
            setSearchText('');
            setShowCityModal(true);
          }}
        />
        <TouchableField
          icon="bus"
          label="To :      "
          value={to}
          onPress={() => {
            setSelectedField('to');
            setSearchText('');
            setShowCityModal(true);
          }}
        />
        <TouchableField
          icon="calendar"
          label="Date of departure  "
          placeholder="Select date"
          value={formatted(date)}
          onPress={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, sd) => {
              setShowDatePicker(false);
              if (sd) setDate(sd);
            }}
          />
        )}
        <SegmentedButtons
          options={['Today', 'Tomorrow']}
          selected={dateOption}
          onSelect={onSelectDateOption}
        />
        <TouchableField
          icon="calendar"
          placeholder="Date of return (optional)"
          label=""
          value={returnDate ? formatted(returnDate) : ''}
          onPress={() => setShowReturnPicker(true)}
        />
        {showReturnPicker && (
          <DateTimePicker
            value={returnDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, sd) => {
              setShowReturnPicker(false);
              if (sd) setReturnDate(sd);
            }}
          />
        )}
      </View>
      <SearchButton icon="magnify" title="Search buses" onPress={validateRoute} />

      <Modal visible={showCityModal} transparent animationType="fade" onRequestClose={() => setShowCityModal(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Search stop"
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
            />
            <View style={styles.flatListWrapper}>
              <FlatList
                data={filteredStops}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.cityItem} onPress={() => handleRouteSelect(item.stop_name)}>
                    <Text style={styles.cityText}>{item.stop_name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps="handled"
              />
            </View>
            <TouchableOpacity onPress={() => setShowCityModal(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showTimesModal} transparent animationType="slide" onRequestClose={() => setShowTimesModal(false)}>
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { maxHeight: '80%', fontFamily: 'Nunito',}]}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Nunito', paddingLeft: 10, paddingTop: 10, color: '#000' }}>Select Departure Time</Text>
            <FlatList
              data={availableTimes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.cityItem} onPress={() => handleCreateBooking(item.id)}>
                  <Text style={styles.cityText}>
                    {item.departure}{' '}<Icon name="arrow-forward" size={16} color="#8c8c8c" fontWeight='bold' />
                    {' '}{item.destination}
                  </Text>
                  <Text>Time: {formatTime(item.departure_time)}</Text>
                  <Text>Duration: {item.duration || 'N/A'} mins</Text>
                  <Text style={styles.bookingTime}>Bus: My Bus</Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />

            <Text style={{ fontWeight: 'bold', paddingBottom: 5, paddingTop: 20, padding: 10, color:"#003", fontSize: 16, fontFamily: 'Nunito' }}>No. of Passengers:</Text>
            <TextInput
              value={noOfPassengers}
              onChangeText={setNoOfPassengers}
              keyboardType="numeric"
              placeholder="Number of passengers"
              style={styles.searchInput}
            />

            <TouchableOpacity onPress={() => setShowTimesModal(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NewBookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e6ed',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
    fontFamily: 'Nunito',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 8,
    width: '80%',
    maxHeight: '80%',
    fontFamily: 'Nunito',
    marginBottom: 20
  },
  cityItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 15,
    paddingTop: 15,
    color: '#4a4a4a'
  },
  cityText: {
    fontSize: 18,
    color: '#4a4a4a'
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#1b204b',
    borderRadius: 5,
  },
  closeText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold'
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    fontFamily: 'Nunito',
    fontSize: 16,
    color: '#918e8e',
    paddingLeft: 10,
    marginHorizontal: 10,
  },
  flatListWrapper: {
    maxHeight: 300,
  },
});