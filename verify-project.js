const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying project structure...\n');

const requiredFiles = {
  'Backend': [
    'backend/package.json',
    'backend/.env',
    'backend/server.js',
    'backend/config/database.js',
    'backend/models/User.js',
    'backend/models/Favorite.js',
    'backend/models/CachedData.js',
    'backend/models/ErrorLog.js',
    'backend/services/weatherService.js',
    'backend/services/aqiService.js',
    'backend/services/climateService.js',
    'backend/services/agricultureService.js',
    'backend/services/cacheService.js',
    'backend/routes/weatherRoutes.js',
    'backend/routes/aqiRoutes.js',
    'backend/routes/climateRoutes.js',
    'backend/routes/agricultureRoutes.js',
    'backend/routes/userRoutes.js',
    'backend/middleware/errorHandler.js',
    'backend/middleware/rateLimiter.js',
    'backend/utils/fallbackHandler.js',
    'backend/utils/logger.js'
  ],
  'Frontend Core': [
    'frontend/package.json',
    'frontend/.env',
    'frontend/index.html',
    'frontend/vite.config.js',
    'frontend/src/main.jsx',
    'frontend/src/App.jsx',
    'frontend/src/App.css'
  ],
  'Frontend Services & Hooks': [
    'frontend/src/services/api.js',
    'frontend/src/hooks/useWeather.js',
    'frontend/src/hooks/useAQI.js',
    'frontend/src/hooks/useLocation.js',
    'frontend/src/utils/constants.js',
    'frontend/src/utils/helpers.js'
  ],
  'Frontend Components - Common': [
    'frontend/src/components/Common/Header.jsx',
    'frontend/src/components/Common/Header.css',
    'frontend/src/components/Common/Footer.jsx',
    'frontend/src/components/Common/Footer.css',
    'frontend/src/components/Common/Loader.jsx',
    'frontend/src/components/Common/Loader.css'
  ],
  'Frontend Components - Search': [
    'frontend/src/components/Search/SearchBar.jsx',
    'frontend/src/components/Search/SearchBar.css',
    'frontend/src/components/Search/Favorites.jsx',
    'frontend/src/components/Search/Favorites.css'
  ],
  'Frontend Components - Dashboard': [
    'frontend/src/components/Dashboard/Dashboard.jsx',
    'frontend/src/components/Dashboard/Dashboard.css'
  ],
  'Frontend Components - Weather': [
    'frontend/src/components/Weather/CurrentWeather.jsx',
    'frontend/src/components/Weather/HourlyForecast.jsx',
    'frontend/src/components/Weather/WeeklyForecast.jsx',
    'frontend/src/components/Weather/WeatherAlerts.jsx',
    'frontend/src/components/Weather/Weather.css'
  ],
  'Frontend Components - AQI': [
    'frontend/src/components/AQI/AQIDisplay.jsx',
    'frontend/src/components/AQI/PollutantBreakdown.jsx',
    'frontend/src/components/AQI/HealthAdvisory.jsx',
    'frontend/src/components/AQI/AQI.css'
  ],
  'Frontend Components - Climate': [
    'frontend/src/components/Climate/HistoricalData.jsx',
    'frontend/src/components/Climate/ClimateProjections.jsx',
    'frontend/src/components/Climate/Climate.css'
  ],
  'Frontend Components - Agriculture': [
    'frontend/src/components/Agriculture/CropRecommendations.jsx',
    'frontend/src/components/Agriculture/Agriculture.css'
  ],
  'Frontend Components - Maps': [
    'frontend/src/components/Maps/WeatherMap.jsx',
    'frontend/src/components/Maps/Maps.css'
  ],
  'Frontend Components - Charts': [
    'frontend/src/components/Charts/LineChart.jsx',
    'frontend/src/components/Charts/BarChart.jsx',
    'frontend/src/components/Charts/DonutChart.jsx'
  ]
};

let totalFiles = 0;
let existingFiles = 0;
let missingFiles = [];

Object.keys(requiredFiles).forEach(category => {
  console.log(`\n📁 ${category}:`);
  requiredFiles[category].forEach(file => {
    totalFiles++;
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      console.log(`  ✅ ${file}`);
      existingFiles++;
    } else {
      console.log(`  ❌ ${file} - MISSING`);
      missingFiles.push(file);
    }
  });
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Summary:`);
console.log(`   Total Files: ${totalFiles}`);
console.log(`   ✅ Existing: ${existingFiles}`);
console.log(`   ❌ Missing: ${missingFiles.length}`);

if (missingFiles.length === 0) {
  console.log('\n🎉🎉🎉 PERFECT! All files exist! 🎉🎉🎉');
  console.log('\n✅ Your project is 100% complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. cd backend && npm install');
  console.log('   2. cd ../frontend && npm install');
  console.log('   3. Start MongoDB');
  console.log('   4. cd backend && npm run dev');
  console.log('   5. cd frontend && npm run dev');
} else {
  console.log('\n⚠️  Missing Files:');
  missingFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
  console.log('\n💡 Run the appropriate setup script to create missing files.');
}
