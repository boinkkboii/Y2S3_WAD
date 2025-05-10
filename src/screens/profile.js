/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { getDBConnection, createUser, getUsers } from '../services/sqlite';  // Assume these functions are defined as earlier
import { PickerWithLabel } from '../UI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';


const RegisterScreen = () => {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const { colors } = useTheme();


    // Handle the registration form submission
    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
          Alert.alert('Please fill all fields');
          return;
        }
      
        if (password !== confirmPassword) {
          Alert.alert('Passwords do not match');
          return;
        }
      
        try {
            const db = await getDBConnection();
      
            // Optional: Check if email already exists
            const users = await getUsers(db);
            const emailExists = users.some(user => user.email === email);
            if (emailExists) {
              Alert.alert('Error', 'Email already registered');
              return;
            }
      
            await createUser(db, name, email, password, dob, gender, phone);
      
            // Simulate login by storing userId (you could return ID from createUser if needed)
            const newUser = users.length + 1; // rough estimate; in production, fetch actual ID
            await AsyncStorage.setItem('loggedInUserId', newUser.toString());
      
            navigation.replace('ProfileMain');
          } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to register');
          }
      };
      

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={[styles.header, { color: colors.text }]}>User Registration</Text>

            <Text style={{ color: colors.text }}>Name</Text>
            <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.text}

            />

            <Text style={{ color: colors.text }}>Email</Text>
            <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                placeholderTextColor={colors.text}
            />

            <Text style={{ color: colors.text }}>Date of Birth</Text>
            <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                value={dob}
                onChangeText={setDob}
                placeholder="Enter your date of birth (YYYY-MM-DD)"
                placeholderTextColor={colors.text}
            />

            <PickerWithLabel
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                items={[
                  { key: 'Male', value: 'Male' },
                  { key: 'Female', value: 'Female' },
                  { key: 'nub', value: 'Others' },
                ]}
                label="Gender"
            />
            <Text style={{ color: colors.text }}>Phone Number</Text>
            <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                placeholderTextColor={colors.text}
            />

            <TextInput 
                style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                value={password}
                onChangeText={setPassword} 
                placeholder="Password" 
                secureTextEntry 
                placeholderTextColor={colors.text}
            />

            <TextInput 
                style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword} 
                placeholder="Confirm Password" 
                secureTextEntry 
                placeholderTextColor={colors.text}
            />
            <View style={{ marginBottom: 40 }}>
                <Button title="Register" onPress={handleRegister} />
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'flex-start',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
        borderRadius: 4,
    },
});

export default RegisterScreen;