const fs = require('fs');
const path = require('path');

console.log('🚀 Creating ALL remaining backend and frontend files...\n');

// ============================================
// BACKEND FILES
// ============================================

const backendFiles = {
  // MODELS
  'backend/models/User.js': `import mongoose from 'mongoose';

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

export default mongoose.model('User', userSchema);`,

  'backend/models/Favorite.js': `import mongoose from 'mongoose';

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

export default mongoose.model('Favorite', favoriteSchema);`,

  'backend/models/CachedData.js': `import mongoose from 'mongoose';

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

export default mongoose.model('CachedData', cachedDataSchema);`,

  'backend/models/ErrorLog.js': `import mongoose from 'mongoose';

const errorLogSchema = new mongoose.Schema({
  errorType: {
    type: String,
    required: true,
    enum: ['API_FAILURE', 'DATABASE_ERROR', 'VALIDATION_ERROR', 'SYSTEM_ERROR']
  },
  apiName: String,
  endpoint: String,
  errorMessage: {
    type: String,
    required: true
  },
  errorStack: String,
  requestData: mongoose.Schema.Types.Mixed,
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export default mongoose.model('ErrorLog', errorLogSchema);`,

  // MIDDLEWARE
  'backend/middleware/errorHandler.js': `import ErrorLog from '../models/ErrorLog.js';

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  ErrorLog.create({
    errorType: 'SYSTEM_ERROR',
    endpoint: req.path,
    errorMessage: err.message,
    errorStack: err.stack,
    requestData: {
      method: req.method,
      query: req.query,
      body: req.body
    },
    severity: 'HIGH'
  }).catch(logErr => console.error('Failed to log error:', logErr));

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;`,

  'backend/middleware/rateLimiter.js': `import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export default limiter;`,

  // ROUTES
  'backend/routes/weatherRoutes.js': `import express from 'express';
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

export default router;`,

  'backend/routes/aqiRoutes.js': `import express from 'express';
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

export default router;`,

  'backend/routes/climateRoutes.js': `import express from 'express';
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

export default router;`,

  'backend/routes/agricultureRoutes.js': `import express from 'express';
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

export default router;`,

  'backend/routes/userRoutes.js': `import express from 'express';
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

export default router;`,

  // UTILS
  'backend/utils/fallbackHandler.js': `import ErrorLog from '../models/ErrorLog.js';

class FallbackHandler {
  async executeWithFallback(apiCalls, dataType) {
    const errors = [];

    for (let i = 0; i < apiCalls.length; i++) {
      const { name, call } = apiCalls[i];
      
      try {
        console.log(\`Attempting \${dataType} API: \${name} (\${i + 1}/\${apiCalls.length})\`);
        const result = await call();
        
        if (result && result.data) {
          console.log(\`✓ Success with \${name}\`);
          return {
            data: result.data,
            source: name,
            fallbackUsed: i > 0
          };
        }
      } catch (error) {
        console.error(\`✗ \${name} failed:\`, error.message);
        errors.push({ apiName: name, error: error.message });
        await this.logError(name, error, dataType);
        continue;
      }
    }

    throw new Error(\`All \${dataType} APIs failed: \${errors.map(e => e.apiName).join(', ')}\`);
  }

  async logError(apiName, error, dataType) {
    try {
      await ErrorLog.create({
        errorType: 'API_FAILURE',
        apiName,
        endpoint: dataType,
        errorMessage: error.message,
        errorStack: error.stack,
        severity: 'HIGH'
      });
    } catch (logError) {
      console.error('Failed to log error:', logError.message);
    }
  }
}

export default new FallbackHandler();`
};

// Create all backend files
function createFiles(files) {
  Object.keys(files).forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, files[filePath]);
    console.log(`✅ Created: ${filePath}`);
  });
}

console.log('📁 Creating backend models, routes, middleware, utils...\n');
createFiles(backendFiles);

console.log('\n✨ Backend files created successfully!');
console.log('\n⚠️  Note: Services files (weatherService.js, aqiService.js, etc.) are TOO LARGE for this script.');
console.log('👉 I will provide them separately. Continue? (Y/n)');
