// ProfileScreen.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    Modal,
    TextInput,
    Button,
    Platform
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getUserById, updateUser, updateUserProfileImage } from '../services/sqlite';
import { TouchableField, PickerWithLabel } from '../UI';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [checkingLogin, setCheckingLogin] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [formData, setFormData] = useState({});
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
                    await AsyncStorage.removeItem('loggedInUserId');
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
        loadProfile();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('loggedInUserId');
        setUser(null);
    };

    const pickImage = () => {
        const options = { mediaType: 'photo', includeBase64: false };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) return;
            if (response.errorCode) return Alert.alert('Error', response.errorMessage);

            const uri = response.assets[0].uri;

            try {
                const db = await getDBConnection();
                await updateUserProfileImage(db, uri);
                setUser((prev) => ({ ...prev, profile_image: uri }));
            } catch (err) {
                Alert.alert("Error", "Failed to update profile image.");
            }
        });
    };

    const handleEditProfile = async () => {
        if (!user) return;
        const db = await getDBConnection();

        if (formData.newPassword && formData.oldPassword !== user.password) {
            return Alert.alert('Error', 'Old password is incorrect.');
        }

        const updatedFields = {
            name: formData.name || user.name,
            email: formData.email || user.email,
            password: formData.newPassword || user.password,
            dob: formData.dob || user.dob,
            gender: formData.gender || user.gender,
            phone: formData.phone || user.phone,
        };

        try {
            await updateUser(db, user.id.toString(), ...Object.values(updatedFields));
            setUser({ ...user, ...updatedFields });
            setEditModalVisible(false);
            Alert.alert('Success', 'Profile updated successfully.');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile.');
        }
    };

    if (checkingLogin) return <Text>Loading...</Text>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {!user ? (
                <>
                    <TouchableField label="Login" onPress={() => navigation.navigate('Login')} />
                    <TouchableField label="Register" onPress={() => navigation.navigate('Register')} />
                </>
            ) : (
                <>
                    <View style={styles.profileContainer}>
                        <TouchableOpacity style={styles.editIcon} onPress={() => setEditModalVisible(true)}>
                            <Icon name="edit-2" size={20} color="#333" />
                        </TouchableOpacity>

                        <View style={styles.profileRow}>

                            <TouchableOpacity onPress={pickImage}>
                                <Image source={user.profile_image ? { uri: user.profile_image } : defaultImage} style={styles.profileImage} />
                            </TouchableOpacity>

                            <View style={styles.textInfo}>
                                <Text style={styles.heading}>{user.name}</Text>
                                <Text style={styles.infoText}>{user.email}</Text>
                                {/* <Text style={styles.infoText}>{user.dob}</Text> */}
                                <Text style={styles.infoText}>{user.gender}</Text>
                                {/* <Text style={styles.infoText}>{user.phone}</Text> */}
                            </View>

                        </View>
                    </View>

                    <View style={styles.optionsContainer}>
                        <TouchableOpacity style={styles.flatButton} onPress={() => navigation.navigate('Booking')}>
                            <View style={styles.flatButtonContent}>
                                <Icon name="calendar" size={20} color="#000" style={styles.leftIcon} />
                                <Text style={styles.flatButtonText}>My Bookings</Text>
                                <Icon name="chevron-right" size={20} color="#888" style={styles.rightIcon1}/>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.separator} />

                        <TouchableOpacity style={styles.flatButton} onPress={() => navigation.navigate('Help')}>
                            <View style={styles.flatButtonContent}>
                                <Icon name="help-circle" size={20} color="#000" style={styles.leftIcon} />
                                <Text style={styles.flatButtonText}>Help & Support</Text>
                                <Icon name="chevron-right" size={20} color="#888" style={styles.rightIcon2}/>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.separator} />

                        <TouchableOpacity style={styles.flatButton} onPress={handleLogout}>
                            <View style={styles.flatButtonContent}>
                                <Icon name="log-out" size={20} color="#f00" style={styles.leftIcon} />
                                <Text style={[styles.flatButtonText, styles.logoutButtonText]}>Log Out</Text>
                                <Icon name="chevron-right" size={20} color="#f00" style={styles.rightIcon3}/>
                            </View>
                        </TouchableOpacity>

                    </View>

                    {/* Edit Profile Modal */}
                    <Modal
                        visible={editModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setEditModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Edit Profile</Text>
                                <ScrollView>
                                    <TextInput style={styles.input} placeholder="Name" onChangeText={(text) => setFormData({ ...formData, name: text })} />
                                    <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => setFormData({ ...formData, email: text })} keyboardType="email-address" />
                                    <TextInput style={styles.input} placeholder="Phone" onChangeText={(text) => setFormData({ ...formData, phone: text })} keyboardType="phone-pad" />
                                    <TextInput style={styles.input} placeholder="DOB (YYYY-MM-DD)" onChangeText={(text) => setFormData({ ...formData, dob: text })} />
                                    <PickerWithLabel
                                        label="Gender"
                                        selectedValue={formData.gender || user.gender}
                                        onValueChange={(val) => setFormData({ ...formData, gender: val })}
                                        items={[{ key: 'Male', value: 'Male' }, { key: 'Female', value: 'Female' }, { key: 'nub', value: 'Others' }]}
                                    />
                                    <TextInput style={styles.input} placeholder="Old Password" secureTextEntry onChangeText={(text) => setFormData({ ...formData, oldPassword: text })} />
                                    <TextInput style={styles.input} placeholder="New Password" secureTextEntry onChangeText={(text) => setFormData({ ...formData, newPassword: text })} />
                                    <Button title="Save Changes" onPress={handleEditProfile} />
                                    <Button title="Cancel" color="gray" onPress={() => setEditModalVisible(false)} />
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9f9f9',
        flexGrow: 1,
        fontFamily: 'Nunito',
    },
    profileContainer: {
        marginBottom: 30,
        backgroundColor: '#fff',
        paddingBottom: 20,
        paddingTop: 20
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10
    },
    textInfo: {
        flex: 1,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000'
    },
    infoText: {
        fontSize: 16,
        marginBottom: 2,
        fontFamily: 'Nunito',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 50,
        marginRight: 10,
    },
    optionsContainer: {
        marginBottom: 30,
    },
    flatButton: {
        backgroundColor: '#ffffff',
        padding: 15,
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
    },
    flatButtonText: {
        color: '#333',
        fontSize: 16,
        margin: 10,
        fontFamily: 'Nunito',
        fontWeight: 'bold'
    },
    leftIcon: {
        marginRight: 12,
    },
    rightIcon1: {
        marginLeft: 195,
    },
    rightIcon2: {
        marginLeft: 180,
    },
    rightIcon3: {
        marginLeft: 235,
    },
    logoutButtonText: {
        color: '#ff0000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    editIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 5,
        zIndex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    flatButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ProfileScreen;
