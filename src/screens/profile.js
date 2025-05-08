import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { createUserTable, getDBConnection, getUserProfile } from "./db-service";
import { TouchableField } from './UI';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = ({ navigation }) => {
    const [profile, setProfile] = useState({
        name: '',
        birthdate: '',
        phone: '',
        email: '',
        profile_image: '',
    });

    const defaultImage = require('../img/profile-pic.png');

    const loadProfile = async () => {
        try {
            const db = await getDBConnection();
            await createUserTable(db);
            const userProfile = await getUserProfile(db);

            if (userProfile) {
                setProfile({
                    name: userProfile.name || '',
                    birthdate: userProfile.dob || '',
                    phone: userProfile.phone || '',
                    email: userProfile.email || '',
                    profile_image: userProfile.profile_image || defaultImage,
                });
            } else {
                setProfile({
                    name: '',
                    birthdate: '',
                    phone: '',
                    email: '',
                    profile_image: defaultImage,
                });
            }
        } catch (error) {
            console.error("Error loading profile:", error.message);
            Alert.alert("Error", "Failed to load profile.");
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    // Function to allow the user to pick a new profile image from the file explorer
    const pickImage = () => {
        const options = {
            mediaType: 'photo', // Allow only photos
            includeBase64: false, // You can set this to true if you want to handle base64 encoding
        };

        // Launch the image library to pick a photo from the file explorer
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
                Alert.alert('Error', response.errorMessage);
            } else {
                // Save the selected image URI to state
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    profile_image: { uri: response.assets[0].uri }, // Update the profile image
                }));
            }
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View>
                <TouchableField
                    label="Register"
                    onPress={() => navigation.navigate('Register')} />
            </View>
            {/* Top Section: Profile Info + Image */}
            <View style={styles.profileContainer}>
                <TouchableOpacity style={styles.editIcon} onPress={() => alert('Edit profile')}>
                    <Icon name="edit-2" size={20} color="#333" />
                </TouchableOpacity>

                <View style={styles.profileRow}>
                    <View style={styles.textInfo}>
                        <Text style={styles.heading}>My Profile</Text>
                        <Text style={styles.infoText}>{profile.name}</Text>
                        <Text style={styles.infoText}>{profile.birthdate}</Text>
                        <Text style={styles.infoText}>{profile.phone}</Text>
                        <Text style={styles.infoText}>{profile.email}</Text>
                    </View>

                    <Image
                        source={
                            !profile.profile_image || profile.profile_image === 'default'
                                ? require('../img/profile-pic.png')  // replace with actual relative path
                                : { uri: profile.profile_image }
                        }
                        style={{ width: 100, height: 100, borderRadius: 50 }}
                    />


                    {/* Button to update the profile image */}
                    <TouchableOpacity onPress={pickImage} style={{ marginTop: 20 }}>
                        <Text>Update Profile Image</Text>
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
                <TouchableOpacity style={styles.flatButton}>
                    <Text style={styles.flatButtonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
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
    editIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 1,
    }
});

export default ProfileScreen;
