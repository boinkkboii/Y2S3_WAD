/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';


const AppContent = () => {
  const { isDark } = useContext(ThemeContext);
  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={styles.container}>
          <AppContent />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});