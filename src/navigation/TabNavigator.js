import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/home';
import DetailsScreen from '../screens/booking';
import AboutScreen from '../screens/about';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Details" component={DetailsScreen} />
                <Tab.Screen name="About" component={AboutScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
