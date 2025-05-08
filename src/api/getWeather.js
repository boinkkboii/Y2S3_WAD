import axios from 'axios';

const getWeather = async (latitude, longitude) => {
  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
            latitude: latitude,
            longitude: longitude,
            current_weather: true
        },
    });
      
    
    const weatherCode = response.data.current_weather.weathercode;
    return interpretWeatherCode(weatherCode);
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
};

// Function to interpret the weather code
const interpretWeatherCode = (code) => {
  if (code === 0) return 'Sunny';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Cloudy';
  if (code >= 51 && code <= 67) return 'Light Rain';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code === 95) return 'Thunderstorm';   
  if (code >= 96) return 'Severe Thunderstorm';
  return 'Unknown Weather';
};

export default getWeather;
