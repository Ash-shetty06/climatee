import express from 'express';
import aqiService from '../services/aqiService.js';

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

    const aqiData = await aqiService.getAQIData(
      parseFloat(lat),
      parseFloat(lon),
      city
    );

    res.json({
      success: true,
      data: aqiData
    });
  } catch (error) {
    console.error('AQI API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AQI data',
      error: error.message
    });
  }
});

export default router;