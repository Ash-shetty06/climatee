import express from 'express';
import User from '../models/User.js';
import Favorite from '../models/Favorite.js';

const router = express.Router();

router.post('/profile', async (req, res) => {
  try {
    const { email, name } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
});

router.get('/favorites/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId });
    res.json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites',
      error: error.message
    });
  }
});

router.post('/favorites', async (req, res) => {
  try {
    const { userId, city, country, lat, lon, nickname } = req.body;
    const favorite = await Favorite.create({ userId, city, country, lat, lon, nickname });
    res.json({ success: true, data: favorite });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Location already in favorites'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to add favorite',
      error: error.message
    });
  }
});

router.delete('/favorites/:id', async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Favorite removed' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove favorite',
      error: error.message
    });
  }
});

export default router;