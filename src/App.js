/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import MainTabStack from './navigation/MainStackNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <MainTabStack />
    </NavigationContainer>
  );
}
