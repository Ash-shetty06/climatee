import express from 'express';
import climateService from '../services/climateService.js';

const router = express.Router();

router.get('/historical', async (req, res) => {
  try {
    const { lat, lon, startDate, endDate, city } = req.query;

    if (!lat || !lon || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Latitude, longitude, startDate, and endDate are required'
      });
    }

    const climateData = await climateService.getHistoricalData(
      parseFloat(lat),
      parseFloat(lon),
      startDate,
      endDate,
      city
    );

    res.json({
      success: true,
      data: climateData
    });
  } catch (error) {
    console.error('Climate API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch climate data',
      error: error.message
    });
  }
});

router.get('/projections', async (req, res) => {
  try {
    const { lat, lon, scenario } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const projections = await climateService.getClimateProjections(
      parseFloat(lat),
      parseFloat(lon),
      scenario || 'RCP4.5'
    );

    res.json({
      success: true,
      data: projections
    });
  } catch (error) {
    console.error('Climate Projections Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch climate projections',
      error: error.message
    });
  }
});

export default router;