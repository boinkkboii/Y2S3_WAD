/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { getDBConnection, createUser, getUsers } from '../services/sqlite';
import { PickerWithLabel } from '../utils/UI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { isValidEmail, isValidPhoneNumber, isValidDOB, isValidPassword } from '../utils/validation';

const RegisterScreen = () => {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');

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
        
        if (!isValidEmail(email)) {
          return Alert.alert('Invalid Email', 'Please enter a valid email address.');
        }
        
        if (!isValidPhoneNumber(phone)) {
          return Alert.alert('Invalid Phone Number', 'Phone number should be between 10-15 digits.');
        }
        
        if (!isValidDOB(dob)) {
          return Alert.alert('Invalid Date of Birth', 'Please enter a valid date in YYYY-MM-DD format.');
        }
        
        if (!isValidPassword(password)) {
            return Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
        }
      
        try {
            const db = await getDBConnection();
            const users = await getUsers(db);
            const emailExists = users.some(user => user.email === email);
            if (emailExists) {
              Alert.alert('Error', 'Email already registered');
              return;
            }
            
            // Simulate login by storing userId (you could return ID from createUser if needed)
            const newUserId = await createUser(db, name, email, password, dob, gender, phone);
            await AsyncStorage.setItem('loggedInUserId', String(newUserId));
                
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
            <Text style={styles.header}>User Registration</Text>

            <Text>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
            />

            <Text>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
            />

            <Text>Date of Birth</Text>
            <TextInput
                style={styles.input}
                value={dob}
                onChangeText={setDob}
                placeholder="Enter your date of birth (YYYY-MM-DD)"
            />

            <PickerWithLabel
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                items={[
                    { value: 'Select Gender:', label: 'Select Gender:', enabled: false },
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'nub', label: 'Other' },
                ]}
                label="Gender"
            />

            <Text>Phone Number</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
            />

            <TextInput 
                style={styles.input}
                value={password}
                onChangeText={setPassword} 
                placeholder="Password" 
                secureTextEntry 
            />
            <TextInput 
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword} 
                placeholder="Confirm Password" 
                secureTextEntry 
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