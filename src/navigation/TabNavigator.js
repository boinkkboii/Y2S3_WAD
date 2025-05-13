/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/homepage';
import BookingStack from '../navigation/BookingStack';
import HelpScreen from '../screens/help';
import ProfileStack from '../navigation/ProfileStack';
import NewBookingScreen from '../screens/newbooking';

export default function TabNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <CurvedBottomBar.Navigator
        type="DOWN"
        style={styles.bottomBar}
        height={60}
        circleWidth={100}
        bgColor="#155A64"
        initialRouteName="Home"
        borderTopLeftRight
        renderCircle={({ selectedTab, navigate }) => (
          <TouchableOpacity
            style={[
              styles.circleButton,
              selectedTab === 'NewBooking' && {backgroundColor: '#d84269'},
            ]}
            onPress={() => navigate('NewBooking')}
          >
            <MaterialCommunityIcons 
              name={selectedTab === 'NewBooking' ? 'book-check' : 'book-plus'} 
              color='white'
              size={30} 
            />
          </TouchableOpacity>
        )}
        tabBar={({ routeName, selectedTab, navigate }) => {
          let iconName;
          if (routeName === 'Home') {
            iconName = 'home';
          } else if (routeName === 'Booking') {
            iconName = 'ticket-confirmation';
          } else if (routeName === 'Help') {
            iconName = 'help-circle';
          } else if (routeName === 'Profile') {
            iconName = 'account';
          }

          return (
            <TouchableOpacity
              onPress={() => navigate(routeName)}
              style={styles.tabButton}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={28}
                color={routeName === selectedTab ? '#f03535' : 'white'}
              />
            </TouchableOpacity>
          );
        }}
      >
        <CurvedBottomBar.Screen name="Home" position="LEFT" component={HomeScreen} />
        <CurvedBottomBar.Screen name="Booking" position="LEFT" component={BookingStack} />
        <CurvedBottomBar.Screen name="NewBooking" position="CENTER" component={NewBookingScreen} />
        <CurvedBottomBar.Screen name="Help" position="RIGHT" component={HelpScreen} />
        <CurvedBottomBar.Screen name="Profile" position="RIGHT" component={ProfileStack} />
      </CurvedBottomBar.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  circleButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#f03535',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
