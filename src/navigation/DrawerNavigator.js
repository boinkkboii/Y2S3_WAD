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

const HomeIcon = () => <MaterialCommunityIcons name="home" size={24} />;
const ContactUsIcon = () => <MaterialCommunityIcons name="phone" size={24} />;
const SettingsIcon = () => <MaterialCommunityIcons name="cog" size={24} />;
const VersionIcon = () => <MaterialCommunityIcons name="alpha-v-circle" size={24} />;
const AboutUsIcon = () => <MaterialCommunityIcons name="information" size={24} />;

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { width: '60%', backgroundColor: 'lightgrey' },
        drawerActiveTintColor: 'blue',
        drawerActiveBackgroundColor: 'skyblue',
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
