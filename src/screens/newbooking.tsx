import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableField, SegmentedButtons, SearchButton } from './UI';
import { formatted } from './utility';
import { Platform } from 'react-native';

const AddBookingScreen: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [dateOption, setDateOption] = useState('Today');

  const onSelectDateOption = (opt: string) => {
    setDateOption(opt);
    // Adjust the date based on selection
    if (opt === 'Today') setDate(new Date());
    else if (opt === 'Tomorrow') {
      const t = new Date();
      t.setDate(t.getDate() + 1);
      setDate(t);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bus Tickets</Text>
      <View style={styles.card}>
        <TouchableField
          icon="bus"
          placeholder="From"
          label=""
          value={from}
          onPress={() => { /* open city picker */ }}
        />
        <TouchableField
          icon="bus"
          placeholder="To"
          label=""
          value={to}
          onPress={() => { /* open city picker */ }}
        />
        <TouchableField
          icon="calendar"
          label="Date of departure              "
          placeholder='Select date'
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
          label=''
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
      <SearchButton icon="magnify" title="Search buses" onPress={() => { /* search logic */ }} />
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
