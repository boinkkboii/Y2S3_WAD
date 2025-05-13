// ProfileScreen.js
import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TextInput,
    Button,
    Platform,
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getUserById, updateUser, updateUserProfileImage } from '../services/sqlite';
import { TouchableField, PickerWithLabel } from '../utils/UI';
import { launchImageLibrary } from 'react-native-image-picker';
import { useFocusEffect } from "@react-navigation/native";
import { isValidEmail, isValidPhoneNumber, isValidDOB, isValidPassword } from '../utils/validation';

export const ProfileScreen = ({ navigation }) => {
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

    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [])
    );

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
                        <TouchableOpacity style={styles.editIcon} onPress={() => navigation.navigate('EditProfile', { user })}>
                            <Icon name="edit-2" size={20} color="#333" />
                        </TouchableOpacity>

                        <View style={styles.profileRow}>
                            <TouchableOpacity onPress={pickImage}>
                                <Image source={user.profile_image ? { uri: user.profile_image } : defaultImage} style={styles.profileImage} />
                            </TouchableOpacity>

                            <View style={styles.textInfo}>
                                <Text style={styles.heading}>{user.name}</Text>
                                <Text style={styles.infoText}>{user.email}</Text>
                                <Text style={styles.infoText}>{user.gender}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.optionsContainer}>
                        <TouchableOpacity style={styles.flatButton} onPress={() => navigation.navigate('Booking', { screen: 'BookingHome' })}>
                            <View style={styles.flatButtonContent}>
                                <Icon name="calendar" size={20} color="#000" style={styles.leftIcon} />
                                <Text style={styles.flatButtonText}>My Bookings</Text>
                                <Icon name="chevron-right" size={20} color="#888" />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.separator} />

                        <TouchableOpacity style={styles.flatButton} onPress={() => navigation.navigate('Help')}>
                            <View style={styles.flatButtonContent}>
                                <Icon name="help-circle" size={20} color="#000" style={styles.leftIcon} />
                                <Text style={styles.flatButtonText}>Help & Support</Text>
                                <Icon name="chevron-right" size={20} color="#888" />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.separator} />
                    </View>
                </>
            )}
        </ScrollView>
    );
};

export const EditProfileScreen = ({ navigation, route }) => {
    const { user } = route.params;
    const [formData, setFormData] = useState({});

    const handleEditProfile = async () => {
        const db = await getDBConnection();

        if (formData.newPassword && formData.oldPassword !== user.password) {
            return Alert.alert('Error', 'Old password is incorrect.');
        }

        if (formData.email && !isValidEmail(formData.email)) {
            return Alert.alert('Invalid Email', 'Please enter a valid email address.');
        }

        if (formData.phone && !isValidPhoneNumber(formData.phone)) {
            return Alert.alert('Invalid Phone Number', 'Phone number should be between 10-15 digits.');
        }

        if (formData.dob && !isValidDOB(formData.dob)) {
            return Alert.alert('Invalid Date of Birth', 'Please enter a valid date in YYYY-MM-DD format.');
        }

        if (formData.newPassword && !isValidPassword(formData.newPassword)) {
            return Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
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
            Alert.alert('Success', 'Profile updated successfully.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.editContainer}>
            <Text style={styles.editTitle}>Edit Profile</Text>
            <TextInput style={styles.input} placeholder="Name" onChangeText={(text) => setFormData({ ...formData, name: text })} />
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={(text) => setFormData({ ...formData, email: text })} />
            <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" onChangeText={(text) => setFormData({ ...formData, phone: text })} />
            <TextInput style={styles.input} placeholder="DOB (YYYY-MM-DD)" onChangeText={(text) => setFormData({ ...formData, dob: text })} />
            <PickerWithLabel
                selectedValue={formData.gender ?? ''}
                onValueChange={(val) => setFormData({ ...formData, gender: val })}
                items={[
                    { value: 'Select Gender:', label: 'Select Gender:', enabled: false },
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'nub', label: 'Other' },
                ]}
            />
            <TextInput style={styles.input} placeholder="Old Password" secureTextEntry onChangeText={(text) => setFormData({ ...formData, oldPassword: text })} />
            <TextInput style={styles.input} placeholder="New Password" secureTextEntry onChangeText={(text) => setFormData({ ...formData, newPassword: text })} />
            <View style={styles.button}>
                <Button title="Cancel" color="gray" onPress={() => navigation.goBack()} />
                <Button color={Platform.OS === 'ios' ? undefined : '#1b204b'} title="Save Changes" onPress={handleEditProfile} />
            </View>
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  textInfo: {
    flex: 1,
    paddingRight: 10,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
    fontFamily: 'Nunito',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#eee',
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  flatButton: {
    backgroundColor: '#ffffff',
    padding: 15,
  },
  flatButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  leftIcon: {
    marginRight: 12,
  },
  logoutButtonText: {
    color: '#ff0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  editTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
    textAlign: 'center',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  editPicker: {
    marginBottom: 12,
  },
  editButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  editButtonText: {
    fontWeight: 'bold',
  },
});