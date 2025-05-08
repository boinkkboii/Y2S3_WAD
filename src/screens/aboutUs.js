import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';

const AboutUsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Company Banner or Logo */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../img/bus.png')} // replace with your image path
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>About Us</Text>

      {/* Company Description */}
      <Text style={styles.text}>
        Welcome to EasyBus, your trusted partner for convenient and reliable bus
        bookings. We are committed to making your travel experience smooth and
        stress-free.
      </Text>

      {/* Mission Section */}
      <Text style={styles.subtitle}>Our Mission</Text>
      <Text style={styles.text}>
        To connect people across cities with safe, affordable, and timely bus
        services — one journey at a time.
      </Text>

      {/* Services Section */}
      <Text style={styles.subtitle}>What We Offer</Text>
      <Text style={styles.text}>
        - Real-time seat availability{'\n'}
        - Easy digital ticket booking{'\n'}
        - 24/7 customer support{'\n'}
        - Routes across major cities and towns
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E2D3A',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#2C3E50',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: '#4F4F4F',
  },
});

export default AboutUsScreen;
