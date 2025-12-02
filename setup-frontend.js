const fs = require('fs');
const path = require('path');

console.log('🚀 Creating ALL frontend files...\n');

const frontendFiles = {
  // ============================================
  // MAIN APP FILES
  // ============================================
  'frontend/src/App.jsx': `import React, { useState, useEffect } from 'react';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import SearchBar from './components/Search/SearchBar';
import Favorites from './components/Search/Favorites';
import useLocation from './hooks/useLocation';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const { getCurrentLocation, loading: locationLoading } = useLocation();

  useEffect(() => {
    const autoDetect = async () => {
      const location = await getCurrentLocation();
      if (location) {
        setSelectedLocation(location);
      }
    };
    autoDetect();
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowFavorites(false);
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <div className="search-section">
          <SearchBar 
            onLocationSelect={handleLocationSelect}
            currentLocation={selectedLocation}
          />
          <button 
            className="favorites-toggle"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            ⭐ Favorites
          </button>
        </div>

        {showFavorites && (
          <Favorites onLocationSelect={handleLocationSelect} />
        )}

        {selectedLocation ? (
          <Dashboard location={selectedLocation} />
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h1>🌍 Weather, Climate & Air Quality Intelligence</h1>
              <p>Your comprehensive environmental data platform</p>
              {locationLoading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Detecting your location...</p>
                </div>
              ) : (
                <div className="features">
                  <div className="feature-card">
                    <span className="icon">🌤️</span>
                    <h3>Real-time Weather</h3>
                    <p>Current conditions + 7-day forecast</p>
                  </div>
                  <div className="feature-card">
                    <span className="icon">💨</span>
                    <h3>Air Quality</h3>
                    <p>AQI + pollutants monitoring</p>
                  </div>
                  <div className="feature-card">
                    <span className="icon">📊</span>
                    <h3>Climate Analytics</h3>
                    <p>Historical data + projections</p>
                  </div>
                  <div className="feature-card">
                    <span className="icon">🌾</span>
                    <h3>Agriculture Insights</h3>
                    <p>Crop recommendations + alerts</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;`,

  'frontend/src/App.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.search-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.favorites-toggle {
  padding: 12px 24px;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.favorites-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.welcome-screen {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  text-align: center;
}

.welcome-content h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.welcome-content > p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 40px;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.feature-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card .icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.feature-card p {
  font-size: 0.95rem;
  opacity: 0.9;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  margin-top: 20px;
  color: #666;
  font-size: 1.1rem;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  grid-auto-rows: minmax(100px, auto);
}

.widget {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.widget:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.widget-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-red {
  background: #fee;
  border-left: 4px solid #dc3545;
  color: #721c24;
}

.alert-orange {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  color: #856404;
}

.alert-yellow {
  background: #fff9e6;
  border-left: 4px solid #ffd700;
  color: #665400;
}

@media (max-width: 1200px) {
  .dashboard {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 768px) {
  .welcome-content h1 {
    font-size: 1.8rem;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .dashboard {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .main-content {
    padding: 10px;
  }
}`,

  // ============================================
  // SERVICES
  // ============================================
  'frontend/src/services/api.js': `import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    console.log(\`API Request: \${config.method.toUpperCase()} \${config.url}\`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(\`API Response: \${response.config.url} - Success\`);
    return response;
  },
  (error) => {
    console.error(\`API Error: \${error.config?.url}\`, error.message);
    return Promise.reject(error);
  }
);

export const weatherAPI = {
  getCurrent: (lat, lon, city) => 
    api.get('/weather/current', { params: { lat, lon, city } })
};

export const aqiAPI = {
  getCurrent: (lat, lon, city) => 
    api.get('/aqi/current', { params: { lat, lon, city } })
};

export const climateAPI = {
  getHistorical: (lat, lon, startDate, endDate, city) => 
    api.get('/climate/historical', { params: { lat, lon, startDate, endDate, city } }),
  
  getProjections: (lat, lon, scenario) => 
    api.get('/climate/projections', { params: { lat, lon, scenario } })
};

export const agricultureAPI = {
  getRecommendations: (lat, lon, city, soilType) => 
    api.get('/agriculture/recommendations', { params: { lat, lon, city, soilType } })
};

export const userAPI = {
  createProfile: (email, name) => 
    api.post('/users/profile', { email, name }),
  
  getFavorites: (userId) => 
    api.get(\`/users/favorites/\${userId}\`),
  
  addFavorite: (userId, city, country, lat, lon, nickname) => 
    api.post('/users/favorites', { userId, city, country, lat, lon, nickname }),
  
  deleteFavorite: (id) => 
    api.delete(\`/users/favorites/\${id}\`)
};

export default api;`,

  // ============================================
  // HOOKS
  // ============================================
  'frontend/src/hooks/useWeather.js': `import { useState, useEffect } from 'react';
import { weatherAPI } from '../services/api';

const useWeather = (location) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await weatherAPI.getCurrent(
          location.lat,
          location.lon,
          location.city
        );

        if (response.data.success) {
          setWeatherData(response.data.data);
        } else {
          setError('Failed to fetch weather data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Network error');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  return { weatherData, loading, error };
};

export default useWeather;`,

  'frontend/src/hooks/useAQI.js': `import { useState, useEffect } from 'react';
import { aqiAPI } from '../services/api';

const useAQI = (location) => {
  const [aqiData, setAQIData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchAQI = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await aqiAPI.getCurrent(
          location.lat,
          location.lon,
          location.city
        );

        if (response.data.success) {
          setAQIData(response.data.data);
        } else {
          setError('Failed to fetch AQI data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Network error');
        console.error('AQI fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAQI();
  }, [location]);

  return { aqiData, loading, error };
};

export default useAQI;`,

  'frontend/src/hooks/useLocation.js': `import { useState } from 'react';

const useLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        resolve(null);
        return;
      }

      setLoading(true);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              \`https://nominatim.openstreetmap.org/reverse?lat=\${latitude}&lon=\${longitude}&format=json\`
            );
            const data = await response.json();
            
            setLoading(false);
            resolve({
              lat: latitude,
              lon: longitude,
              city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
              country: data.address?.country || ''
            });
          } catch (err) {
            setLoading(false);
            resolve({
              lat: latitude,
              lon: longitude,
              city: 'Current Location',
              country: ''
            });
          }
        },
        (err) => {
          setLoading(false);
          setError('Unable to retrieve your location');
          console.error('Geolocation error:', err);
          resolve(null);
        }
      );
    });
  };

  return { getCurrentLocation, loading, error };
};

export default useLocation;`,

  // ============================================
  // UTILS
  // ============================================
  'frontend/src/utils/constants.js': `export const API_ENDPOINTS = {
  WEATHER: '/weather/current',
  AQI: '/aqi/current',
  CLIMATE_HISTORICAL: '/climate/historical',
  CLIMATE_PROJECTIONS: '/climate/projections',
  AGRICULTURE: '/agriculture/recommendations'
};

export const AQI_CATEGORIES = {
  GOOD: { min: 0, max: 50, color: '#4caf50', label: 'Good' },
  MODERATE: { min: 51, max: 100, color: '#ffeb3b', label: 'Moderate' },
  UNHEALTHY: { min: 151, max: 200, color: '#f44336', label: 'Unhealthy' }
};`,

  'frontend/src/utils/helpers.js': `export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};`
};

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

createFiles(frontendFiles);

console.log('\n✨ Core frontend files created!');
console.log('\n📝 Next: Component files (run setup-components.js)');
