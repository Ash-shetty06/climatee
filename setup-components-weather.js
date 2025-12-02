const fs = require('fs');
const path = require('path');

console.log('🚀 Creating Weather components...\n');

const files = {
  'frontend/src/components/Weather/CurrentWeather.jsx': `import React from 'react';
import './Weather.css';

const CurrentWeather = ({ data, location }) => {
  if (!data || !data.data) return null;

  const current = data.data.current;

  const getWeatherIcon = (condition) => {
    const icons = {
      'clear': '☀️',
      'partly': '⛅',
      'cloud': '☁️',
      'rain': '🌧️',
      'storm': '⛈️',
      'snow': '🌨️',
      'fog': '🌫️'
    };
    
    const conditionLower = (condition || '').toLowerCase();
    for (const key in icons) {
      if (conditionLower.includes(key)) return icons[key];
    }
    return '🌤️';
  };

  return (
    <div className="current-weather">
      <div className="widget-header">
        <h2 className="widget-title">Current Weather</h2>
        <span className="location-badge">📍 {location.city}</span>
      </div>

      <div className="weather-main">
        <div className="weather-icon-large">
          {getWeatherIcon(current.condition)}
        </div>
        <div className="weather-temp">
          <div className="temp-value">{Math.round(current.temperature)}°C</div>
          <div className="temp-feels">Feels like {Math.round(current.feelsLike)}°C</div>
          <div className="weather-condition">{current.condition}</div>
        </div>
      </div>

      <div className="weather-details-grid">
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{current.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">💨</span>
          <span className="detail-label">Wind</span>
          <span className="detail-value">{current.windSpeed} km/h</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🌡️</span>
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{current.pressure} mb</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">☁️</span>
          <span className="detail-label">Cloud Cover</span>
          <span className="detail-value">{current.cloudCover}%</span>
        </div>
        {current.uvIndex && (
          <div className="detail-item">
            <span className="detail-icon">☀️</span>
            <span className="detail-label">UV Index</span>
            <span className="detail-value">{current.uvIndex}</span>
          </div>
        )}
        {current.visibility && (
          <div className="detail-item">
            <span className="detail-icon">👁️</span>
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{current.visibility} km</span>
          </div>
        )}
      </div>

      <div className="timestamp">
        Last updated: {new Date(current.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default CurrentWeather;`,

  'frontend/src/components/Weather/HourlyForecast.jsx': `import React from 'react';
import './Weather.css';

const HourlyForecast = ({ data }) => {
  if (!data) return null;

  return (
    <div className="hourly-forecast">
      <div className="widget-header">
        <h2 className="widget-title">48-Hour Forecast</h2>
      </div>

      <div className="hourly-scroll">
        {data.time.slice(0, 48).map((time, index) => {
          const hour = new Date(time).getHours();
          const temp = Math.round(data.temperature[index]);
          const precip = data.precipitationProbability?.[index] || 0;
          
          return (
            <div key={index} className="hourly-item">
              <div className="hourly-time">{hour}:00</div>
              <div className="hourly-icon">
                {precip > 50 ? '🌧️' : temp > 30 ? '☀️' : '⛅'}
              </div>
              <div className="hourly-temp">{temp}°</div>
              {precip > 0 && (
                <div className="hourly-precip">💧 {precip}%</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;`,

  'frontend/src/components/Weather/WeeklyForecast.jsx': `import React from 'react';
import './Weather.css';

const WeeklyForecast = ({ data }) => {
  if (!data) return null;

  const getDayName = (dateString) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(dateString).getDay()];
  };

  const getWeatherIcon = (code) => {
    if (code <= 3) return '☀️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 95) return '⛈️';
    return '⛅';
  };

  return (
    <div className="weekly-forecast">
      <div className="widget-header">
        <h2 className="widget-title">7-Day Forecast</h2>
      </div>

      <div className="weekly-list">
        {data.time.map((date, index) => (
          <div key={index} className="weekly-item">
            <div className="weekly-day">
              {index === 0 ? 'Today' : getDayName(date)}
            </div>
            <div className="weekly-icon">
              {getWeatherIcon(data.weatherCode?.[index])}
            </div>
            <div className="weekly-temps">
              <span className="temp-max">{Math.round(data.temperatureMax[index])}°</span>
              <span className="temp-min">{Math.round(data.temperatureMin[index])}°</span>
            </div>
            {data.precipitationProbability && (
              <div className="weekly-precip">
                💧 {data.precipitationProbability[index]}%
              </div>
            )}
            {data.uvIndexMax && (
              <div className="weekly-uv">
                ☀️ UV {Math.round(data.uvIndexMax[index])}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;`,

  'frontend/src/components/Weather/WeatherAlerts.jsx': `import React from 'react';
import './Weather.css';

const WeatherAlerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="weather-alerts">
        <div className="widget-header">
          <h2 className="widget-title">Weather Alerts</h2>
        </div>
        <div className="no-alerts">
          <span className="no-alerts-icon">✅</span>
          <p>No active weather alerts</p>
        </div>
      </div>
    );
  }

  const getAlertClass = (severity) => {
    const classes = {
      'HIGH': 'alert-red',
      'MEDIUM': 'alert-orange',
      'LOW': 'alert-yellow'
    };
    return classes[severity] || 'alert-yellow';
  };

  const getAlertIcon = (type) => {
    const icons = {
      'HEATWAVE': '🌡️',
      'HEAVY_RAIN': '🌧️',
      'STRONG_WIND': '💨',
      'STORM': '⛈️',
      'COLD': '❄️'
    };
    return icons[type] || '⚠️';
  };

  return (
    <div className="weather-alerts">
      <div className="widget-header">
        <h2 className="widget-title">Weather Alerts</h2>
      </div>

      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <div key={index} className={\`alert \${getAlertClass(alert.severity)}\`}>
            <span className="alert-icon">{getAlertIcon(alert.type)}</span>
            <div className="alert-content">
              <strong>{alert.type.replace('_', ' ')}</strong>
              <p>{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAlerts;`,

  'frontend/src/components/Weather/Weather.css': `.current-weather {
  height: 100%;
}

.location-badge {
  background: #f0f0f0;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #666;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 30px;
  margin: 20px 0;
}

.weather-icon-large {
  font-size: 5rem;
}

.weather-temp {
  flex: 1;
}

.temp-value {
  font-size: 3.5rem;
  font-weight: 700;
  color: #333;
}

.temp-feels {
  font-size: 1rem;
  color: #666;
  margin-top: 5px;
}

.weather-condition {
  font-size: 1.2rem;
  color: #667eea;
  font-weight: 500;
  margin-top: 5px;
}

.weather-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-icon {
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.detail-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.timestamp {
  margin-top: 20px;
  font-size: 0.85rem;
  color: #999;
  text-align: center;
}

.hourly-scroll {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 20px 0;
  scrollbar-width: thin;
}

.hourly-scroll::-webkit-scrollbar {
  height: 6px;
}

.hourly-scroll::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 3px;
}

.hourly-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.hourly-time {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.hourly-icon {
  font-size: 2rem;
  margin: 8px 0;
}

.hourly-temp {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.hourly-precip {
  font-size: 0.8rem;
  color: #3498db;
  margin-top: 5px;
}

.weekly-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.weekly-item {
  display: grid;
  grid-template-columns: 80px 60px 100px 80px 60px;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.weekly-item:hover {
  background: #e9ecef;
}

.weekly-day {
  font-weight: 600;
  color: #333;
}

.weekly-icon {
  font-size: 2rem;
  text-align: center;
}

.weekly-temps {
  display: flex;
  gap: 10px;
}

.temp-max {
  font-weight: 600;
  color: #dc3545;
}

.temp-min {
  color: #666;
}

.weekly-precip, .weekly-uv {
  font-size: 0.9rem;
  color: #666;
}

.no-alerts {
  text-align: center;
  padding: 40px 20px;
}

.no-alerts-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 15px;
}

.no-alerts p {
  color: #666;
  font-size: 1.1rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-icon {
  font-size: 1.5rem;
  margin-right: 5px;
}

.alert-content strong {
  display: block;
  margin-bottom: 5px;
  text-transform: capitalize;
}

.alert-content p {
  margin: 0;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .weather-main {
    flex-direction: column;
    text-align: center;
  }

  .weekly-item {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .weekly-icon {
    grid-column: span 2;
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
console.log('\n✨ Weather components created!\n');
