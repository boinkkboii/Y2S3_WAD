import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList, StackOptionList } from './Types';
import About from './screens/about';
import {Booking} from './screens/booking';
import Home from './screens/home';
import {Login} from './screens/login';
import Profile from "./screens/profile";
import {Register} from "./screens/register";
import {Settings} from "./screens/settings";
import RootNavigator from './navigation/RootNavigator';

const Stack = createStackNavigator();

class App extends Component {
  render () {  
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={StackOptionList}>
          <Stack.Screen 
            name="Home" 
            component={Home} 
            options={{ title: 'Home' }}>
          </Stack.Screen>
          <Stack.Screen 
            name="About" 
            component={About} 
            options={{}}>
          </Stack.Screen>
          <Stack.Screen 
            name="Profile"
            component={Profile}
            options={{}}>
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;