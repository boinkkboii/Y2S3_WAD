/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getUsers } from '../services/sqlite';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <View style={styles.container}>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 10, borderBottomWidth: 1, padding: 8 },
});
