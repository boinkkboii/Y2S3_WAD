import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Platform, TextInput, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableField, SegmentedButtons, SearchButton } from './UI';
import { formatted } from './utility';
import { downloadAndUnzipGTFS } from '../api/zipDecompress';
import RNFS from 'react-native-fs';
import Papa from 'papaparse';

const NewBookingScreen: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [dateOption, setDateOption] = useState('Today');
  const [stops, setStops] = useState<string[]>([]);
  const [routesData, setRoutesData] = useState<any[]>([]);
  const [tripsData, setTripsData] = useState<any[]>([]);
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedField, setSelectedField] = useState<'from' | 'to' | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchStopsAndTrips = async () => {
      try {
        const unzipPath = await downloadAndUnzipGTFS();

        // Load stops.txt
        const stopsPath = `${unzipPath}/stops.txt`;
        const fileContent = await RNFS.readFile(stopsPath, 'utf8');
        const parsedStops = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

        const stopNames = parsedStops.data
          .map((entry: any) => entry.stop_name)
          .filter((name: string | undefined) => typeof name === 'string' && name.trim() !== '');

        const uniqueStops = Array.from(new Set(stopNames)).sort();
        setStops(uniqueStops);

        // Load trips.txt and routes.txt
        const tripsPath = `${unzipPath}/trips.txt`;
        const routesPath = `${unzipPath}/routes.txt`;

        const tripsFile = await RNFS.readFile(tripsPath, 'utf8');
        const routesFile = await RNFS.readFile(routesPath, 'utf8');

        const parsedTrips = Papa.parse(tripsFile, { header: true, skipEmptyLines: true });
        const parsedRoutes = Papa.parse(routesFile, { header: true, skipEmptyLines: true });

        setTripsData(parsedTrips.data);
        setRoutesData(parsedRoutes.data);
      } catch (error) {
        console.error('Error reading GTFS files:', error);
      }
    };

    fetchStopsAndTrips();
  }, []);

  const onSelectDateOption = (opt: string) => {
    setDateOption(opt);
    const today = new Date();
    if (opt === 'Today') setDate(today);
    else if (opt === 'Tomorrow') {
      today.setDate(today.getDate() + 1);
      setDate(today);
    }
  };

  const handleRouteSelect = (stop: string) => {
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

      const routeFound = routesData.some((route: any) =>
        route.route_long_name.includes(from) && route.route_long_name.includes(to)
      );

      // const tripFound = tripsData.some((trip: any) =>
      //   trip.from_stop === from && trip.to_stop === to
      // );

      // const returnTripFound = returnDate
      //   ? tripsData.some((trip: any) => trip.from_stop === to && trip.to_stop === from)
      //   : true;



      const tripFound = tripsData.some((trip) =>
        trip.from_stop && trip.to_stop && 
        trip.from_stop.toLowerCase() === from.toLowerCase() && 
        trip.to_stop.toLowerCase() === to.toLowerCase()
      );
      
      const returnTripFound = returnDate
        ? tripsData.some((trip) =>
            trip.from_stop && trip.to_stop && 
            trip.from_stop.toLowerCase() === to.toLowerCase() && 
            trip.to_stop.toLowerCase() === from.toLowerCase()
          )
        : true; // If no return date is provided, we don't need to check for return trip
      

      if (!routeFound && !tripFound) {
        Alert.alert('Route not found', 'No available route between the selected stops.');
      } else if (!returnTripFound) {
        Alert.alert('Return route not found', 'No available return route between the selected stops.');
      } else {
        Alert.alert('Route found', returnDate ? 'Outbound and return route are available!' : 'Route is available!');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bus Tickets</Text>
      <View style={styles.card}>
        <TouchableField
          icon="bus"
          placeholder="From"
          label="From"
          value={from}
          onPress={() => {
            setSelectedField('from');
            setSearchText('');
            setShowCityModal(true);
          }}
        />
        <TouchableField
          icon="bus"
          placeholder="To"
          label="To"
          value={to}
          onPress={() => {
            setSelectedField('to');
            setSearchText('');
            setShowCityModal(true);
          }}
        />
        <TouchableField
          icon="calendar"
          label="Date of departure"
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
    </View>
  );
};

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
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxHeight: '80%',
  },
  cityItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cityText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 6,
  },
  flatListWrapper: {
    maxHeight: 300,
  },
});

export default NewBookingScreen;
