const fs = require('fs');
const path = require('path');

// Backend Files
const backendFiles = {
  'backend/package.json': `{
  "name": "weather-intelligence-backend",
  "version": "1.0.0",
  "description": "Weather, Climate & AQI Intelligence Platform Backend",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "axios": "^1.6.2",
    "node-cache": "^5.1.2",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}`,

  'backend/.env': `PORT=5000
MONGODB_URI=mongodb://localhost:27017/weather-intelligence
NODE_ENV=development

# Weather APIs
OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1/forecast
OPEN_METEO_HISTORICAL_BASE_URL=https://archive-api.open-meteo.com/v1/archive
WEATHERAPI_KEY=3a9f4b247f8e4cb68f044921250212
WEATHERAPI_BASE_URL=https://api.weatherapi.com/v1
IMD_BASE_URL=https://imd-api.example
VISUAL_CROSSING_KEY=XFBQVJGGR5K3U9VNSHYS922A3
VISUAL_CROSSING_BASE_URL=https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services

# AQI APIs
AQICN_KEY=f4d52e4cac65407c45d531517efa20beccaf291a
AQICN_BASE_URL=https://api.waqi.info
OPENAQ_BASE_URL=https://api.openaq.org/v2/latest
CPCB_BASE_URL=https://cpcb-api.example

# Climate APIs
NOAA_TOKEN=UGAOJKcISCZKLfebDJBmvbQoOuYtaflY
NOAA_BASE_URL=https://www.ncei.noaa.gov/cdo-web/api/v2
KAGGLE_DATASET_URL=https://your-kaggle-dataset.csv

# Agriculture APIs
OPENFARM_BASE_URL=https://openfarm.cc/api/v1/crops

# Cache Settings
CACHE_TTL=300`,

  'backend/config/database.js': `import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};

export default connectDB;`,

  'backend/server.js': `import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './config/database.js';
import weatherRoutes from './routes/weatherRoutes.js';
import aqiRoutes from './routes/aqiRoutes.js';
import climateRoutes from './routes/climateRoutes.js';
import agricultureRoutes from './routes/agricultureRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import rateLimiter from './middleware/rateLimiter.js';

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Weather Intelligence API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/aqi', aqiRoutes);
app.use('/api/climate', climateRoutes);
app.use('/api/agriculture', agricultureRoutes);
app.use('/api/users', userRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`
╔═══════════════════════════════════════════════════════════╗
║   Weather, Climate & AQI Intelligence Platform API       ║
║   Server running on port \${PORT}                             ║
║   Environment: \${process.env.NODE_ENV || 'development'}                      ║
╚═══════════════════════════════════════════════════════════╝
  \`);
});

export default app;`
};

// Frontend Files
const frontendFiles = {
  'frontend/package.json': `{
  "name": "weather-intelligence-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2",
    "react-leaflet": "^4.2.1",
    "leaflet": "^1.9.4",
    "react-apexcharts": "^1.4.1",
    "apexcharts": "^3.45.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}`,

  'frontend/.env': `VITE_API_BASE_URL=http://localhost:5000/api
VITE_MAPTILER_API_KEY=7hNQolFhU9OE1CEMc4Nx`,

  'frontend/vite.config.js': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});`,

  'frontend/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather, Climate & AQI Intelligence Platform</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`,

  'frontend/src/main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
};

// Create all files
function createFiles(files) {
  Object.keys(files).forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    const dir = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(fullPath, files[filePath]);
    console.log(`✅ Created: ${filePath}`);
  });
}

console.log('🚀 Starting file generation...\n');

console.log('📁 Creating backend files...');
createFiles(backendFiles);

console.log('\n📁 Creating frontend files...');
createFiles(frontendFiles);

console.log('\n✨ All files created successfully!');
console.log('\n📝 Next steps:');
console.log('1. cd backend && npm install');
console.log('2. cd frontend && npm install');
console.log('3. Start MongoDB');
console.log('4. cd backend && npm run dev');
console.log('5. cd frontend && npm run dev');
