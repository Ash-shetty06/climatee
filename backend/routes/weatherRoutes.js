import express from 'express';
import weatherService from '../services/weatherService.js';

const router = express.Router();

router.get('/current', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const weatherData = await weatherService.getCurrentWeather(
      parseFloat(lat),
      parseFloat(lon),
      city
    );

    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message
    });
  }
});

export default router;