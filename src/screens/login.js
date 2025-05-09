import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getUsers } from '../services/sqlite';
import { useTheme } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { colors } = useTheme();

  

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      const db = await getDBConnection();
      const users = await getUsers(db);
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        Alert.alert('Error', 'Invalid credentials');
        return;
      }

      await AsyncStorage.setItem('loggedInUserId', user.id.toString());
      navigation.replace('ProfileMain');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Login failed');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.text}
        onChangeText={setEmail}
        value={email}
        style={[
          styles.input,
          {
            color: colors.text,
            borderBottomColor: colors.border,
          },
        ]}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={colors.text}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={[
          styles.input,
          {
            color: colors.text,
            borderBottomColor: colors.border,
          },
        ]}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'top',
  },
  input: {
    marginBottom: 16,
    borderBottomWidth: 1,
    padding: Platform.OS === 'ios' ? 12 : 8,
  },
});
