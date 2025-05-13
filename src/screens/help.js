import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { loadFAQData } from '../services/json';

const HelpScreen = () => {
  const [faqData, setFaqData] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadFAQData();
      setFaqData(data);
    }
    fetchData();
  }, []);

  const toggleFAQ = index => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const goToContactUs = () => {
    navigation.navigate('Contact Us');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Help & FAQs</Text>
        <Text style={styles.description}>
          Here are some of the most frequently asked questions to help you use our bus booking service with ease.
        </Text>

        {faqData.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity onPress={() => toggleFAQ(index)}>
              <Text style={styles.question}>{item.question}</Text>
            </TouchableOpacity>
            {expandedIndex === index && (
              <Text style={styles.answer}>{item.answer}</Text>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.contactLink} onPress={goToContactUs}>
          <Text style={styles.contactText}>Still need help? Contact Us</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E2D3A',
  },
  description: {
    fontSize: 16,
    color: '#4F4F4F',
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingBottom: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  answer: {
    marginTop: 8,
    fontSize: 16,
    color: '#4F4F4F',
    lineHeight: 22,
  },
  contactLink: {
    marginTop: 40,
    alignItems: 'center',
  },
  contactText: {
    color: '#1E90FF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default HelpScreen;