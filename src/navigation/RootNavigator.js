/* eslint-disable prettier/prettier */
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import TabNavigator from './TabNavigator';
import ContactUs from '../screens/contactUs';
import Settings from '../screens/settings';
import Version from '../screens/version';
import AboutUs from '../screens/aboutUs';

const Drawer = createDrawerNavigator();

const icon = (name) => () => <MaterialCommunityIcons name={name} size={24} />;

export default function RootNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      screenOptions={{
        drawerStyle: { width: '50%', backgroundColor: 'lightgrey' },
        drawerActiveTintColor: 'blue',
        drawerActiveBackgroundColor: 'skyblue',
      }}
    >
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{
          title: 'Home',
          drawerIcon: icon('home'),
        }}
      />
      <Drawer.Screen
        name="Contact Us"
        component={ContactUs}
        options={{
          drawerIcon: icon('phone'),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: icon('cog'),
        }}
      />
      <Drawer.Screen
        name="Version"
        component={Version}
        options={{
          drawerIcon: icon('alpha-v-circle'),
        }}
      />
      <Drawer.Screen
        name="About Us"
        component={AboutUs}
        options={{
          drawerIcon: icon('information'),
        }}
      />
    </Drawer.Navigator>
  );
}
