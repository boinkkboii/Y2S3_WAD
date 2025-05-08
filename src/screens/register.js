import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getDBConnection, upsertUserProfile, createUserTable } from './db-service';  // Assume these functions are defined as earlier

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState('');

    // Handle the registration form submission
    const handleSubmit = async () => {
        try {
            const db = await getDBConnection();
            await createUserTable(db);
            await upsertUserProfile(db, name, dob, phone, email, profileImage); // Use real input values
            Alert.alert("Success", "Registration complete");
            navigation.navigate("Profile");
        } catch (error) {
            Alert.alert("Error", "Registration failed");
            console.error(error);
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

            <Button title="Register" onPress={handleSubmit} />
            <Button title="Login" onPress={ () => navigation.navigate('Login')}></Button>
            <Button title="Go Back" onPress={() => navigation.goBack()} />
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
