const fs = require('fs');
const path = require('path');

console.log('🚀 Creating Dashboard component...\n');

const files = {
  'frontend/src/components/Dashboard/Dashboard.jsx': `import React, { useState } from 'react';
import CurrentWeather from '../Weather/CurrentWeather';
import HourlyForecast from '../Weather/HourlyForecast';
import WeeklyForecast from '../Weather/WeeklyForecast';
import WeatherAlerts from '../Weather/WeatherAlerts';
import AQIDisplay from '../AQI/AQIDisplay';
import PollutantBreakdown from '../AQI/PollutantBreakdown';
import HealthAdvisory from '../AQI/HealthAdvisory';
import HistoricalData from '../Climate/HistoricalData';
import ClimateProjections from '../Climate/ClimateProjections';
import CropRecommendations from '../Agriculture/CropRecommendations';
import WeatherMap from '../Maps/WeatherMap';
import Loader from '../Common/Loader';
import useWeather from '../../hooks/useWeather';
import useAQI from '../../hooks/useAQI';
import './Dashboard.css';

const Dashboard = ({ location }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { weatherData, loading: weatherLoading, error: weatherError } = useWeather(location);
  const { aqiData, loading: aqiLoading, error: aqiError } = useAQI(location);

  if (weatherLoading || aqiLoading) {
    return <Loader message="Loading environmental data..." />;
  }

  if (weatherError || aqiError) {
    return (
      <div className="error-container">
        <h2>⚠️ Error Loading Data</h2>
        <p>{weatherError || aqiError}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={activeTab === 'climate' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('climate')}
        >
          📈 Climate Analytics
        </button>
        <button 
          className={activeTab === 'agriculture' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('agriculture')}
        >
          🌾 Agriculture
        </button>
        <button 
          className={activeTab === 'map' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('map')}
        >
          🗺️ Map View
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="dashboard">
          <div className="widget weather-current" style={{gridColumn: 'span 4'}}>
            <CurrentWeather data={weatherData} location={location} />
          </div>

          <div className="widget aqi-display" style={{gridColumn: 'span 4'}}>
            <AQIDisplay data={aqiData} />
          </div>

          <div className="widget weather-alerts" style={{gridColumn: 'span 4'}}>
            <WeatherAlerts alerts={weatherData?.data?.alerts || []} />
          </div>

          <div className="widget hourly-forecast" style={{gridColumn: 'span 12'}}>
            <HourlyForecast data={weatherData?.data?.hourly} />
          </div>

          <div className="widget weekly-forecast" style={{gridColumn: 'span 8'}}>
            <WeeklyForecast data={weatherData?.data?.daily} />
          </div>

          <div className="widget pollutant-breakdown" style={{gridColumn: 'span 4'}}>
            <PollutantBreakdown data={aqiData?.data?.pollutants} />
          </div>

          <div className="widget health-advisory" style={{gridColumn: 'span 12'}}>
            <HealthAdvisory data={aqiData?.data?.healthAdvisory} aqi={aqiData?.data?.aqi} />
          </div>
        </div>
      )}

      {activeTab === 'climate' && (
        <div className="dashboard">
          <div className="widget" style={{gridColumn: 'span 12'}}>
            <HistoricalData location={location} />
          </div>
          <div className="widget" style={{gridColumn: 'span 12'}}>
            <ClimateProjections location={location} />
          </div>
        </div>
      )}

      {activeTab === 'agriculture' && (
        <div className="dashboard">
          <div className="widget" style={{gridColumn: 'span 12'}}>
            <CropRecommendations location={location} weatherData={weatherData} />
          </div>
        </div>
      )}

      {activeTab === 'map' && (
        <div className="dashboard">
          <div className="widget" style={{gridColumn: 'span 12', minHeight: '600px'}}>
            <WeatherMap location={location} weatherData={weatherData} aqiData={aqiData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;`,

  'frontend/src/components/Dashboard/Dashboard.css': `.dashboard-container {
  width: 100%;
}

.dashboard-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tab {
  padding: 12px 24px;
  background: white;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #666;
}

.tab:hover {
  background: #f8f9fa;
}

.tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.error-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
}

.error-container h2 {
  color: #dc3545;
  margin-bottom: 10px;
}

.error-container p {
  color: #666;
}

@media (max-width: 768px) {
  .dashboard-tabs {
    flex-direction: column;
  }

  .tab {
    width: 100%;
  }
}`
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

createFiles(files);
console.log('\n✨ Dashboard component created!\n');
