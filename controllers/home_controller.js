const { getWeatherData } = require('../services/weather_service');
const Task = require('../models/tasks');

exports.getHomePage = async (req, res) => {
  try {
    // Check if the user is logged in
    const user = req.session.user;

    if (!user) {
      // Redirect to login if the user is not logged in
      res.redirect('/users/login');
      return;
    }

    // For demonstration purposes, using a fixed location and API key
    const userLocation = 'London';
    const apiKey = '39ccb57170c04df4b7853421231412';

    // Fetch weather data using the external service
    const weatherData = await getWeatherData(userLocation, apiKey);

    // Fetch tasks in progress for the logged-in user
    const inProgressTasks = await Task.findAll({
      where: {
        user_id: user.user_id,
        status: 'In Progress'
      }
    });

    // Render the home page with user, weather data, and in-progress tasks
    res.render('home', { user, weatherData, inProgressTasks });
  } catch (error) {
    console.error('Error rendering home page:', error);
    res.status(500).send('Internal Server Error');
  }
};
