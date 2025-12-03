import React from 'react';
import './AQI.css';

const PollutantBreakdown = ({ data }) => {
  if (!data) return null;

  const pollutants = [
    { key: 'pm25', name: 'PM2.5', icon: '💨', unit: 'µg/m³', color: '#e74c3c' },
    { key: 'pm10', name: 'PM10', icon: '🌫️', unit: 'µg/m³', color: '#e67e22' },
    { key: 'no2', name: 'NO₂', icon: '🏭', unit: 'µg/m³', color: '#f39c12' },
    { key: 'so2', name: 'SO₂', icon: '⚗️', unit: 'µg/m³', color: '#9b59b6' },
    { key: 'co', name: 'CO', icon: '🚗', unit: 'µg/m³', color: '#34495e' },
    { key: 'o3', name: 'O₃', icon: '☀️', unit: 'µg/m³', color: '#3498db' }
  ];

  return (
    <div className="pollutant-breakdown">
      <div className="widget-header">
        <h2 className="widget-title">Pollutant Levels</h2>
      </div>

      <div className="pollutants-list">
        {pollutants.map(pollutant => {
          const value = data[pollutant.key];
          if (value === null || value === undefined) return null;

          return (
            <div key={pollutant.key} className="pollutant-item">
              <div className="pollutant-header">
                <span className="pollutant-icon">{pollutant.icon}</span>
                <span className="pollutant-name">{pollutant.name}</span>
              </div>
              <div className="pollutant-value" style={{ color: pollutant.color }}>
                {value.toFixed(1)} <span className="pollutant-unit">{pollutant.unit}</span>
              </div>
              <div className="pollutant-bar">
                <div 
                  className="pollutant-fill"
                  style={{ 
                    width: `${Math.min((value / 100) * 100, 100)}%`,
                    background: pollutant.color 
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollutantBreakdown;