/* eslint-disable prettier/prettier */
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';

const getCoordinates = async placeName => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: placeName,
          key: GOOGLE_MAPS_API_KEY,
          components: 'country:MY', //Restricted to Malaysia
        },
      },
    );

    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      throw new Error(`No results found for ${placeName}`);
    }
  } catch (error) {
    console.error(
      `Error fetching coordinates for ${placeName}:`,
      error.message,
    );
    throw new Error(
      `Error fetching coordinates for ${placeName}: ${error.message}`,
    );
  }
};

export default getCoordinates;
