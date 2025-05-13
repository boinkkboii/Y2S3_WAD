/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import styles from '../utils/aboutScreen.styles';

const AboutUsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../img/bus.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <Text style={styles.title}>About Us</Text>

      <Text style={styles.text}>
        Welcome to EasyBus, your trusted partner for convenient and reliable bus
        bookings. We are committed to making your travel experience smooth and
        stress-free.
      </Text>

      <Text style={styles.subtitle}>Our Mission</Text>
      <Text style={styles.text}>
        To connect people across cities with safe, affordable, and timely bus
        services — one journey at a time.
      </Text>

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

export default AboutUsScreen;
