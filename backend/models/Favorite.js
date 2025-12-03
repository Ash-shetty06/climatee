import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: String,
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  },
  nickname: String,
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

favoriteSchema.index({ userId: 1, city: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);