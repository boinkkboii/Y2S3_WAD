import React, { useContext } from 'react';
import { View, Text, Switch, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function Settings({ navigation }) {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  // Function to handle logout
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => {
            // Clear user data and redirect to login screen
            // For example: Clear local storage or state management (e.g., Redux, Context)
            // navigation.navigate('Login'); // Redirect to login screen
        }},
      ]
    );
  };

  // Function to handle account deletion
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => {
            // Proceed with account deletion
            // Call API to delete the account or handle the logic
            // navigation.navigate('Login'); // Redirect to login screen after deletion
        }},
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#e1e6ed' }]}>
      <Text style={[styles.heading, { color: isDark ? '#fff' : '#000' }]}>Settings</Text>

      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, { color: isDark ? '#fff' : '#000' }]}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <View style={styles.buttonsContainer}>
        {/* Logout Button */}
        <View style={styles.buttonWrapper}>
          <Button title="Logout" onPress={handleLogout} />
        </View>

        {/* Delete Account Button */}
        <View style={styles.buttonWrapper}>
          <Button title="Delete Account" onPress={handleDeleteAccount} color="red" />
        </View>

        {/* Go Back Button */}
        <View style={styles.buttonWrapper}>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </View>
  );
}

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
    textAlign: 'left', // Align the "Setting" title to the left
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  switchLabel: {
    fontSize: 18,
    marginRight: 10,
    fontFamily: 'Nunito',
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 30,
  },
  buttonWrapper: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden', // This ensures that the buttons look sleek with rounded corners
    backgroundColor: 'transparent', // Button background is transparent
    borderWidth: 0, // Remove border if there's any
    shadowColor: 'transparent', // Remove any shadow
  },
  logoutWrapper: {
    borderBottomWidth: 1, // Grey underline to separate sections
    borderBottomColor: '#d3d3d3', // Light grey color for the underline
    paddingBottom: 10,
    marginBottom: 10,
  },
  deleteAccountWrapper: {
    borderBottomWidth: 1, // Grey underline to separate sections
    borderBottomColor: '#d3d3d3', // Light grey color for the underline
    paddingBottom: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#000000', // Default button text color
    fontFamily: 'Nunito',
  },
  darkModeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});


