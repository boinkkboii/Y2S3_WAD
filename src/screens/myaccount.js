import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { createUserTable, getDBConnection, getUserProfile, insertUserProfile } from "./db-service";


const Profile = ({ navigation }) => {
    const [profile, setProfile] = useState({
        name: '',
        birthdate: '',
        phone: '',
        email: '',
    });

    const loadProfile = async () => {
        try {
            const db = await getDBConnection();
            await createUserTable(db);
            await insertUserProfile(db, 'John', '1990-01-01', '+1234567890', 'johndoe@example.com', '/images/profile/johndoe.png');
            const userProfile = await getUserProfile(db);
            if (userProfile) {
                setProfile({
                    name: userProfile.name || '',
                    birthdate: userProfile.dob || '',
                    phone: userProfile.phone || '',
                    email: userProfile.email || '',
                });
            } else {
                Alert.alert("Error", "Profile not found.");
            }
        } catch (error) {
            console.error("Error loading profile:", error.message);
            Alert.alert("Error", "Failed to load profile.");
        }
    };
    
    //useEffect must be outside of any function
    useEffect(() => {
        loadProfile();
    }, []);
    

    //     useEffect(() => {
    //       fetch('http://10.0.2.2:5000/api/profile') // Use your real IP & port
    //           .then(response => response.json())
    //           .then(data => {
    //               if (data) {
    //                   setProfile({
    //                       name: data.name || '',
    //                       birthdate: data.dob || '',
    //                       phone: data.phone || '',
    //                       email: data.email || '',
    //                   });
    //               } else {
    //                   Alert.alert("Error", "Profile not found.");
    //               }
    //           })
    //           .catch(error => {
    //               console.error("Fetch error:", error.message);
    //               Alert.alert("Error", "Failed to load profile.");
    //           });
    //   }, []);

  
    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                        source={{ uri: 'https://images.unsplash.com/photo-1627693685101-687bf0eb1222?q=80&w=2070&auto=format&fit=crop' }}
                        style={styles.profileImage}
                    />
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

export default Profile;
