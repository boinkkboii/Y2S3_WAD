import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const VersionScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* App Title */}
      <View style={styles.headerContainer}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>myBus</Text>
        </View>
        <View style={styles.versionContainer}>
          <MaterialCommunityIcons name="alpha-v-circle" size={20} color="#0077b6" />
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </View>

      {/* About the App Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>About This App</Text>
        <Text style={styles.paragraph}>
          myBus is a modern and easy-to-use bus booking app built for convenience, speed, and reliability.
          Book your ride, manage your bookings, and get help — all in one place.
        </Text>
      </View>

      {/* Credits Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Credits</Text>
        <Text style={styles.paragraph}>
          Developed by: SLEEPLESS SWE{'\n'}
          UI/UX Design: Lai ZiYing, Alison Ho{'\n'}
          Backend Integration: Chan Tze Jing{'\n'}
          Professional Freerider: Chong Rong Quan
        </Text>
      </View>

      {/* Contact Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.paragraph}>Email: support@myBus.com</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E3F2FD', // Light blue background for the screen
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E88E5', // Blue color for title
    marginBottom: 5,
    textAlign: 'center',
  },
  titleBox: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 10,
  },
  version: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077b6',
    marginLeft: 6,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#1E88E5', // Blue accent on the left border
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1565C0', // Darker blue for section titles
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4F4F4F',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 16,
    color: '#1E88E5', // Blue color for footer link
    textDecorationLine: 'underline',
  },
});

export default VersionScreen;