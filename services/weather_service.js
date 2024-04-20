// services/weatherService.js

const axios = require('axios');

const getWeatherData = async (location, apiKey) => {
  try {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

module.exports = { getWeatherData };