import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  preferences: {
    temperatureUnit: {
      type: String,
      enum: ['celsius', 'fahrenheit'],
      default: 'celsius'
    },
    windSpeedUnit: {
      type: String,
      enum: ['kmh', 'mph', 'ms'],
      default: 'kmh'
    },
    defaultLocation: {
      city: String,
      lat: Number,
      lon: Number
    }
  },
  recentSearches: [{
    city: String,
    lat: Number,
    lon: Number,
    searchedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.pre('save', function(next) {
  if (this.recentSearches.length > 10) {
    this.recentSearches = this.recentSearches.slice(-10);
  }
  next();
});

export default mongoose.model('User', userSchema);