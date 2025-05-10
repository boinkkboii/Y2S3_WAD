/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TabNavigator from './TabNavigator';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import ContactUs from '../screens/contactUs';
import Settings from '../screens/settings';
import Version from '../screens/version';
import AboutUs from '../screens/aboutUs';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getUserById } from '../services/sqlite';

import backgroundImg from '../img/profilebackground.png';

const Drawer = createDrawerNavigator();

const HomeIcon = () => <MaterialCommunityIcons name="home" size={24} color='#1b204b'/>;
const ContactUsIcon = () => <MaterialCommunityIcons name="phone" size={24} color='#1b204b'/>;
const SettingsIcon = () => <MaterialCommunityIcons name="cog" size={24} color='#1b204b'/>;
const VersionIcon = () => <MaterialCommunityIcons name="alpha-v-circle" size={24} color='#1b204b'/>;
const AboutUsIcon = () => <MaterialCommunityIcons name="information" size={24} color='#1b204b'/>;

function CustomDrawerContent(props) {
  const [user, setUser] = useState(null);

  const loadProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('loggedInUserId');
      if (userId) {
        const db = await getDBConnection();
        const userProfile = await getUserById(db, userId);
        if (userProfile) {
          setUser(userProfile);
        } else {
          await AsyncStorage.removeItem('loggedInUserId');
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error.message);
      Alert.alert("Error", "Failed to load profile.");
    } finally {
      setCheckingLogin(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <ImageBackground
      source={backgroundImg} style={styles.backgroundImage} >

    <View style={styles.overlay} />

        <View style={styles.profileContainer}>
          {user ? (
            <View style={styles.textInfo}>
              <Text style={styles.heading}>{user.name}</Text>
              <Text style={styles.infoText}>{user.email}</Text>
              <Text style={styles.infoText}>{user.gender}</Text>
            </View>
          ) : (
            <Text>Loading user...</Text>
          )}
        </View>
        </ImageBackground>

        <View style={styles.drawerListContainer}>
          <DrawerItemList {...props} />
        </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { width: '65%', backgroundColor: '#fff'},
        drawerActiveBackgroundColor: '#e3e3e3',
        drawerLabelStyle: {
          fontFamily: 'Nunito', // Make sure you have Nunito font installed
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1b204b'
        },
      }}
    >
      <Drawer.Screen
        name="MainHome"
        component={TabNavigator}
        options={{
          drawerIcon: HomeIcon,
        }}
      />
      <Drawer.Screen
        name="Contact Us"
        component={ContactUs}
        options={{
          drawerIcon: ContactUsIcon,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: SettingsIcon,
        }}
      />
      <Drawer.Screen
        name="Version"
        component={Version}
        options={{
          drawerIcon: VersionIcon,
        }}
      />
      <Drawer.Screen
        name="About Us"
        component={AboutUs}
        options={{
          drawerIcon: AboutUsIcon,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  textInfo: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000'
  },
  infoText: {
    fontSize: 16,
    marginBottom: 2,
    fontFamily: 'Nunito',
    zIndex: 2,
    color: '#1b204b'
  },
  backgroundImage: {
    resizeMode: 'cover',
    padding: 20,
    position: 'relative',
  },
  profileContainer: {
    zIndex: 1, // Ensure it's above the overlay
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.29)', // adjust last number (0.0 to 1.0) for transparency
  },
  drawerListContainer: {
    marginTop: 20,
  },
});
