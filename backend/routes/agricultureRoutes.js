import express from 'express';
import agricultureService from '../services/agricultureService.js';
import weatherService from '../services/weatherService.js';

const router = express.Router();

router.get('/recommendations', async (req, res) => {
  try {
    const { lat, lon, city, soilType } = req.query;

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

    const recommendations = await agricultureService.getCropRecommendations(
      parseFloat(lat),
      parseFloat(lon),
      city,
      weatherData.data,
      soilType || 'loam'
    );

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Agriculture API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agriculture recommendations',
      error: error.message
    });
  }
});

export default router;