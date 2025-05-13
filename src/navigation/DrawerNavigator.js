/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useContext } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, ImageBackground, Alert } from 'react-native';

import { ThemeContext } from '../context/ThemeContext';
import TabNavigator from './TabNavigator';
import ContactUs from '../screens/contactUs';
import Settings from '../screens/settings';
import Version from '../screens/version';
import AboutUs from '../screens/aboutUs';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getUserById } from '../services/sqlite';
import backgroundImg from '../img/profilebackground.png';

const Drawer = createDrawerNavigator();

// Custom drawer content with user profile info
function CustomDrawerContent(props) {
  const [user, setUser] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);

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
      console.error('Error loading profile:', error.message);
      Alert.alert('Error', 'Failed to load profile.');
    } finally {
      setCheckingLogin(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
        <View style={styles.overlay} />
        <View style={styles.profileContainer}>
          {checkingLogin ? (
            <Text>Loading user...</Text>
          ) : user ? (
            <View style={styles.textInfo}>
              <Text style={styles.heading}>{user.name}</Text>
              <Text style={styles.infoText}>{user.email}</Text>
              <Text style={styles.infoText}>{user.gender}</Text>
            </View>
          ) : (
            <Text>No user found</Text>
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
  const { isDark } = useContext(ThemeContext);

  const getIconColor = (focused) =>
    focused ? (isDark ? '#fff' : '#1b204b') : (isDark ? '#ccc' : '#888');

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: '65%',
          backgroundColor: isDark ? '#1a1a1a' : '#fff',
        },
        drawerActiveTintColor: isDark ? '#fff' : '#1b204b',
        drawerInactiveTintColor: isDark ? '#ccc' : '#888',
        drawerActiveBackgroundColor: isDark ? '#333' : '#e3e3e3',
        drawerLabelStyle: {
          fontFamily: 'Nunito',
          fontSize: 16,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: isDark ? '#121212' : '#f9f9f9',
        },
        headerTintColor: isDark ? '#fff' : '#000',
      }}
    >
      <Drawer.Screen
        name="MainHome"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="home"
              size={24}
              color={getIconColor(focused)}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Contact Us"
        component={ContactUs}
        options={{
          drawerIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="phone"
              size={24}
              color={getIconColor(focused)}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="cog"
              size={24}
              color={getIconColor(focused)}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Version"
        component={Version}
        options={{
          drawerIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="alpha-v-circle"
              size={24}
              color={getIconColor(focused)}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="About Us"
        component={AboutUs}
        options={{
          drawerIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="information"
              size={24}
              color={getIconColor(focused)}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  textInfo: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 2,
    fontFamily: 'Nunito',
    zIndex: 2,
    color: '#1b204b',
  },
  backgroundImage: {
    resizeMode: 'cover',
    padding: 20,
    position: 'relative',
  },
  profileContainer: {
    zIndex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.29)',
  },
  drawerListContainer: {
    marginTop: 20,
  },
});
