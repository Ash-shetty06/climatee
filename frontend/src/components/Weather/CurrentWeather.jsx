import React from 'react';
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

export default CurrentWeather;