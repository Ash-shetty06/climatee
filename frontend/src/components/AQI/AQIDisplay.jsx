import React from 'react';
import './AQI.css';

const AQIDisplay = ({ data }) => {
  if (!data || !data.data) return null;

  const aqiData = data.data;
  const aqi = aqiData.aqi;
  const category = aqiData.category;

  const getAQIEmoji = (aqi) => {
    if (aqi <= 50) return '😊';
    if (aqi <= 100) return '😐';
    if (aqi <= 150) return '😷';
    if (aqi <= 200) return '😨';
    return '☠️';
  };

  return (
    <div className="aqi-display">
      <div className="widget-header">
        <h2 className="widget-title">Air Quality Index</h2>
      </div>

      <div className="aqi-main">
        <div className="aqi-emoji">{getAQIEmoji(aqi)}</div>
        <div className="aqi-info">
          <div className="aqi-value" style={{ color: category.color }}>
            {aqi}
          </div>
          <div className="aqi-category" style={{ background: category.color }}>
            {category.level}
          </div>
          <div className="aqi-dominant">
            Main Pollutant: {aqiData.dominantPollutant}
          </div>
        </div>
      </div>

      <div className="aqi-station">
        📍 Station: {aqiData.station?.name || 'Unknown'}
      </div>

      <div className="aqi-timestamp">
        Last updated: {new Date(aqiData.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default AQIDisplay;