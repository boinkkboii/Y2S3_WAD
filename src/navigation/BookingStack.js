// BookingStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BookingScreen from '../screens/booking';
import BookingDetailScreen from '../screens/bookingDetails';

const Stack = createStackNavigator();

export default function BookingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookingHome" component={BookingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen}/>
    </Stack.Navigator>
  );
}
