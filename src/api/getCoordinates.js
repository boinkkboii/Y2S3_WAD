import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBZrll3tgm2h-DrUnU91Rtg3Aw9_8tyY-c';

const getCoordinates = async (placeName) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: placeName,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    } else {
      throw new Error(`No results found for ${placeName}`);
    }
  } catch (error) {
    console.error(`Error fetching coordinates for ${placeName}:`, error.message);
    throw new Error(`Error fetching coordinates for ${placeName}: ${error.message}`);
  }
};

export default getCoordinates;
