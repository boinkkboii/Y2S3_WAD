import faqData from '../../assets/faqData.json';

export const loadFAQData = async () => {
  try {
    return faqData;
  } catch (error) {
    console.error('Error loading FAQ data:', error);
    return [];
  }
};
