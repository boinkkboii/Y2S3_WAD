/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getUserById, updateUserProfileImage } from '../services/sqlite';
import { TouchableField } from '../UI';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [checkingLogin, setCheckingLogin] = useState(true);
    const defaultImage = require('../img/profile.png');

    const loadProfile = async () => {
        try {
            const userId = await AsyncStorage.getItem('loggedInUserId');
            if (userId) {
                const db = await getDBConnection();
                const userProfile = await getUserById(db, userId);
                if (userProfile) {
                    setUser(userProfile);
                } else {
                    await AsyncStorage.removeItem('loggedInUserId'); // Invalid user, log out
                }
            }
        } catch (error) {
            console.error("Error loading profile:", error.message);
            Alert.alert("Error", "Failed to load profile.");
        } finally {
            setCheckingLogin(false);
        }
    };
    
    useEffect(() => {
          loadProfile(); // this will always run when screen is focused
    }, [])
    
    const handleLogout = async () => {
        await AsyncStorage.removeItem('loggedInUserId');
        setUser(null);
    };

    const goToLogin = () => navigation.navigate('Login');
    const goToRegister = () => navigation.navigate('Register');

    const pickImage = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
                Alert.alert('Error', response.errorMessage);
            } else {
                const uri = response.assets[0].uri;

                try {
                    const db = await getDBConnection();
                    await updateUserProfileImage(db, uri);

                    setUser((prevUser) => ({
                        ...prevUser,
                        profile_image: uri,
                    }));
                } catch (err) {
                    console.error("Failed to save profile image:", err.message);
                    Alert.alert("Error", "Failed to update profile image.");
                }
            }
        });
    };

    if (checkingLogin) return <Text>Loading...</Text>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {!user ? (
                <>
                    {/* Display Login and Register if the user is not logged in */}
                    <TouchableField 
                        label="Login"
                        onPress={goToLogin}
                    />
                    <TouchableField 
                        label="Register"
                        onPress={goToRegister}
                    />
                </>
            ) : (
                <>
                    {/* Top Section: Profile Info + Image */}
                    <View style={styles.profileContainer}>
                        <TouchableOpacity style={styles.editIcon} onPress={() => alert('Edit profile')}>
                            <Icon name="edit-2" size={20} color="#333" />
                        </TouchableOpacity>

                        <View style={styles.profileRow}>
                            <View style={styles.textInfo}>
                                <Text style={styles.heading}>My Profile</Text>
                                <Text style={styles.infoText}>{user.name}</Text>
                                <Text style={styles.infoText}>{user.email}</Text>
                                <Text style={styles.infoText}>{user.dob}</Text>
                                <Text style={styles.infoText}>{user.gender}</Text>
                                <Text style={styles.infoText}>{user.phone}</Text>
                                
                            </View>

                            {/* Profile Image with Image Picker */}
                            <TouchableOpacity onPress={pickImage}>
                                <Image
                                    source={
                                        user.profile_image && typeof user.profile_image === 'string'
                                            ? { uri: user.profile_image }
                                            : defaultImage
                                    }
                                    style={styles.profileImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bottom Section: Options */}
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity style={styles.flatButton} onPress={() => navigation.navigate('Booking')}>
                            <Text style={styles.flatButtonText}>My Bookings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flatButton}>
                            <Text style={styles.flatButtonText}>Personal Information</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flatButton}>
                            <Text style={styles.flatButtonText}>Payment Methods</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flatButton} onPress={() => navigation.navigate('Help')}>
                            <Text style={styles.flatButtonText}>Help & Support</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flatButton} onPress={handleLogout}>
                            <Text style={styles.logoutButtonText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#f9f9f9',
        flexGrow: 1,
    },
    profileContainer: {
        marginBottom: 30,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        elevation: 3,
    },
    profileRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textInfo: {
        flex: 1,
        paddingRight: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    optionsContainer: {
        marginBottom: 30,
    },
    flatButton: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    flatButtonText: {
        color: '#333',
        fontSize: 16,
        textAlign: 'center',
    },
    logoutButtonText: {
        color: '#ff0000',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    editIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 1,
    }
});

export default ProfileScreen;
