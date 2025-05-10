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
  Modal,
  TextInput,
  Button
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDBConnection, getUserById, updateUser, updateUserProfileImage } from '../services/sqlite';
import { TouchableField, PickerWithLabel } from '../UI';
import { launchImageLibrary } from 'react-native-image-picker';
import { useFocusEffect } from "@react-navigation/native";

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
              <View style={styles.textInfo}>
                <Text style={styles.heading}>My Profile</Text>
                <Text style={styles.infoText}>{user.name}</Text>
                <Text style={styles.infoText}>{user.email}</Text>
                <Text style={styles.infoText}>{user.dob}</Text>
                <Text style={styles.infoText}>{user.gender}</Text>
                <Text style={styles.infoText}>{user.phone}</Text>
              </View>

              <TouchableOpacity onPress={pickImage}>
                <Image source={user.profile_image ? { uri: user.profile_image } : defaultImage} style={styles.profileImage} />
              </TouchableOpacity>
            </View>
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
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
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
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    textAlign: 'center',
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});

export default ProfileScreen;