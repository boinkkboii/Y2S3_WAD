import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getDBConnection, upsertUserProfile } from './db-service';  // Assume these functions are defined as earlier

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState('');

    // Handle the registration form submission
    const handleSubmit = async () => {
        if (!name || !dob || !phone || !email || !profileImage) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const db = await getDBConnection();
            await upsertUserProfile(db, name, dob, phone, email, profileImage);
            Alert.alert('Success', 'Profile created/updated successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to save profile');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>User Registration</Text>

            <Text>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
            />

            <Text>Date of Birth</Text>
            <TextInput
                style={styles.input}
                value={dob}
                onChangeText={setDob}
                placeholder="Enter your date of birth (YYYY-MM-DD)"
            />

            <Text>Phone Number</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
            />

            <Text>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
            />

            <Text>Profile Image URL</Text>
            <TextInput
                style={styles.input}
                value={profileImage}
                onChangeText={setProfileImage}
                placeholder="Enter the URL of your profile image"
            />

            <Button title="Register" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        flex: 1,
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
