import mongoose from 'mongoose';

const cachedDataSchema = new mongoose.Schema({
  cacheKey: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  dataType: {
    type: String,
    required: true,
    enum: ['weather', 'aqi', 'climate', 'agriculture']
  },
  location: {
    lat: Number,
    lon: Number,
    city: String
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

cachedDataSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('CachedData', cachedDataSchema);