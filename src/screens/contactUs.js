import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { InputWithLabel } from './UI'

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Simple form validation
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    // Handle form submission (e.g., send an email, API call, etc.)
    Alert.alert('Success', 'Your message has been sent!');
    
    // Clear form fields
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Contact Us</Text>

      <InputWithLabel
        //style={styles.input}
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
        placeholder="Enter your message"
        multiline
        numberOfLines={4}
        value={message}
        onChangeText={setMessage}
      />

      <Button title="Send Message" onPress={handleSubmit} />

      <Text style={styles.contactInfo}>Or contact us directly:</Text>
      <Text>Phone: +123 456 7890</Text>
      <Text>Email: contact@company.com</Text>
      <Text>Address: 123, Business Street, City, Country</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e6ed',
    padding: 16,
  },
  // heading: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   marginBottom: 12,
  //   color: '#000000',
  //   fontFamily: 'Nurito',
  // },
  // label: {
  //   fontSize: 16,
  //   marginBottom: 8,
  //   marginTop: 12,
  // },
  // input: {
  //   height: 40,
  //   borderColor: '#ccc',
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   paddingLeft: 8,
  //   marginBottom: 12,
  // },
  // textArea: {
  //   height: 100,
  //   textAlignVertical: 'top', // To ensure text starts at the top of the InputWithLabel
  // },
  // contactInfo: {
  //   marginTop: 20,
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
});

export default ContactUs;
