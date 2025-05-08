import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, FlatList } from 'react-native';
import { getDBConnection, getUsers, getBookings, getSchedules, getBuses } from '../services/sqlite';

const HomeScreen = ({ route, navigation }) => {
  const [user, setUsers] = useState([]);
  const [bus, setBuses] = useState([]);
  const [schedule, setSchedules] = useState([]);
  const [booking, setBookings] = useState([]);

  const _query = async () => {
    const db = await getDBConnection();
    setUsers(await getUsers(db));
    setBuses(await getBuses(db));
    setSchedules(await getSchedules(db));
    setBookings(await getBookings(db));
  };

  useEffect(() => {
    _query();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={user}
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) => (
          <TouchableHighlight underlayColor="pink">
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemSubtitle}>{item.email}</Text>
            </View>
          </TouchableHighlight>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <FlatList
        data={bus}
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) => (
          <TouchableHighlight underlayColor="pink">
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.car_plate}</Text>
              <Text style={styles.itemSubtitle}>{item.driver_name}</Text>
            </View>
          </TouchableHighlight>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  item: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
  },
  itemSubtitle: {
    fontSize: 18,
  },
});

export default HomeScreen;
