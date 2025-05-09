/* eslint-disable prettier/prettier */
import React, { useState , useContext} from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableField, SegmentedButtons, SearchButton } from '../UI';
import { formatted } from '../utility';
import { ThemeContext } from '../context/ThemeContext'; // import ThemeContext
import { LightTheme, DarkTheme } from '../context/theme'; // import theme styles

const AddBookingScreen = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [dateOption, setDateOption] = useState('Today');
  const { isDark } = useContext(ThemeContext); // get the theme state
  const theme = isDark ? DarkTheme : LightTheme; // decide the theme based on the current state

  const onSelectDateOption = (option) => {
    setDateOption(option);
    const baseDate = new Date();
    if (option === 'Today') {
      setDate(baseDate);
    } else if (option === 'Tomorrow') {
      baseDate.setDate(baseDate.getDate() + 1);
      setDate(baseDate);
    }
  };

  const handleSearch = () => {
    // Replace with actual search logic
    console.log('Searching buses from:', from, 'to:', to, 'on:', formatted(date));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Bus Tickets</Text>

      <View style={styles.card}>
        {/* From City Picker */}
        <TouchableField
          icon="bus"
          placeholder="From"
          label=""
          value={from}
          onPress={() => {
            // Open 'From' city picker logic
          }}
        />

        {/* To City Picker */}
        <TouchableField
          icon="bus"
          placeholder="To"
          label=""
          value={to}
          onPress={() => {
            // Open 'To' city picker logic
          }}
        />

        {/* Departure Date */}
        <TouchableField
          icon="calendar"
          label="Date of departure              "
          placeholder="Select date"
          value={formatted(date)}
          onPress={() => setShowDatePicker(true)}
        />

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Today / Tomorrow Buttons */}
        <SegmentedButtons
          options={['Today', 'Tomorrow']}
          selected={dateOption}
          onSelect={onSelectDateOption}
        />

        {/* Return Date (Optional) */}
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
            onChange={(_, selectedDate) => {
              setShowReturnPicker(false);
              if (selectedDate) setReturnDate(selectedDate);
            }}
          />
        )}
      </View>

      {/* Search Button */}
      <SearchButton
        icon="magnify"
        title="Search buses"
        onPress={handleSearch}
      />
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
    fontFamily: 'Nurito',
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
  
});

export default AddBookingScreen;
