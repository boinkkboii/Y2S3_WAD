import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen, EditProfileScreen } from '../screens/profile';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;