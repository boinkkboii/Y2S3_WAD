import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import { Linking } from 'react-native';
import { isValidEmail } from '../utils/validation';
import { InputWithLabel, AppButton } from '../utils/UI';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnim] = useState(new Animated.Value(0)); // Modal animation

  const handleSubmit = () => {
    // Simple form validation
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }

    // Handle form submission (e.g., send an email, API call, etc.)
    Alert.alert('Success', 'Your message has been sent!');

    // Clear form fields
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleContactChoice = (contactMethod) => {
    setModalVisible(false);
    
    if (contactMethod === 'phone') {
      // Open dialer with number
      Linking.openURL('tel:+1234567890');
    } else {
      // Open default mail app with email address
      Linking.openURL('mailto:mybus@mybus.my');
    }
  };
  

  // Function to open the modal with animation
  const openModal = () => {
    setModalVisible(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Function to close the modal with animation
  const closeModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Contact Us</Text>

      <InputWithLabel
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <InputWithLabel
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <InputWithLabel
        style={styles.textArea}
        placeholder="Enter your message"
        multiline
        numberOfLines={4}
        value={message}
        onChangeText={setMessage}
      />

      <AppButton title="Send Message" onPress={handleSubmit} />

      {/* Contact Info Section */}
      <Text style={styles.contactInfoHeading}>Or contact us directly:</Text>

      {/* Touchable Text to open Modal */}
      <TouchableOpacity onPress={openModal}>
        <Text style={styles.contactText}>Click here</Text>
      </TouchableOpacity>

      {/* Modal for Phone and Email selection */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none" // Disable default modal animation
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  {
                    translateY: modalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.modalTitle}>Choose Contact Method</Text>

            {/* Phone Option */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleContactChoice('phone')}
            >
              <Text style={styles.modalButtonText}>Phone: +123 456 7890</Text>
            </TouchableOpacity>

            {/* Email Option */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleContactChoice('email')}
            >
              <Text style={styles.modalButtonText}>Email: mybus@mybus.my</Text>
            </TouchableOpacity>

            {/* Close Icon at Top Right */}
            <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e6ed',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
    fontFamily: 'Nunito',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  contactInfoHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    fontFamily: 'Nunito',
  },
  contactText: {
    fontSize: 16,
    color: '#0066cc',
    marginTop: 10,
    fontFamily: 'Nunito',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'Nunito',
    color: '#000000',
  },
  modalButton: {
    backgroundColor: '#1b204b',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Nunito',
    fontWeight: 'bold',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 1,
  },
  closeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#666',
  },
  
});

export default ContactUs;