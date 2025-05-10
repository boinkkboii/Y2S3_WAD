import React, { useContext } from 'react';
import {
  View, Text, Switch, Alert, TouchableOpacity, StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import { getDBConnection, deleteUser } from '../services/sqlite';

export default function Settings({ navigation }) {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const getTextColor = () => (isDark ? '#fff' : '#000');
  const getBgColor = () => (isDark ? '#1c1c1c' : '#fff');

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK", onPress: async () => {
          try {
            await AsyncStorage.removeItem('loggedInUserId');
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainHome'}],
            });
          } catch (error) {
            Alert.alert("Error", "Logout failed.");
          }
        }
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK", onPress: async () => {
            try {
              const userId = await AsyncStorage.getItem('loggedInUserId');
              if (userId) {
                const db = await getDBConnection();
                await deleteUser(db, userId);
                await AsyncStorage.removeItem('loggedInUserId');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainHome' }],
                });
              } else {
                Alert.alert("Error", "User not found.");
              }
            } catch (error) {
              console.error("Account deletion error:", error.message);
              Alert.alert("Error", "Failed to delete account.");
            }
          }
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#e1e6ed' }]}>
      <Text style={[styles.heading, { color: getTextColor() }]}>Settings</Text>

      <View style={[styles.switchContainer, { backgroundColor: getBgColor() }]}>
        <View style={styles.iconRow}>
          <Icon name="moon-o" size={20} color={getTextColor()} style={styles.icon} />
          <Text style={[styles.switchLabel, { color: getTextColor() }]}>Dark Mode</Text>
        </View>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <View style={[styles.buttonsContainer, { backgroundColor: getBgColor() }]}>
        <View style={styles.buttonsGroup}>
          <TouchableOpacity onPress={handleLogout} style={styles.iconRow}>
            <Icon name="sign-out" size={20} color={getTextColor()} style={styles.icon} />
            <Text style={[styles.buttonText, { color: getTextColor() }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: isDark ? '#9c9991' : 'grey' }]} />

        <View style={styles.buttonsGroup}>
          <TouchableOpacity onPress={handleDeleteAccount} style={styles.iconRow}>
            <Icon name="trash" size={20} color="red" style={styles.icon} />
            <Text style={[styles.buttonText, { color: 'red' }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Nunito',
    textAlign: 'left',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 30,
    padding: 20,
    borderRadius: 8,
    elevation: 3,
  },
  switchLabel: { fontSize: 18, fontFamily: 'Nunito' },
  buttonsContainer: {
    width: '100%',
    marginTop: 10,
    gap: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Nunito',
    marginLeft: 6,
  },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 25, textAlign: 'center' },
  divider: { height: 1, marginVertical: 4, width: '100%' },
  buttonsGroup: { padding: 8 },
});