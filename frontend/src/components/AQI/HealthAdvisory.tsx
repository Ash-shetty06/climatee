import React from 'react';
import './AQI.css';

const HealthAdvisory = ({ data, aqi }) => {
  if (!data) return null;

  const getHealthIcon = (aqi) => {
    if (aqi <= 50) return '💚';
    if (aqi <= 100) return '💛';
    if (aqi <= 150) return '🧡';
    if (aqi <= 200) return '❤️';
    return '💜';
  };

  return (
    <div className="health-advisory">
      <div className="widget-header">
        <h2 className="widget-title">Health Advisory</h2>
        <span className="health-icon">{getHealthIcon(aqi)}</span>
      </div>

      <div className="advisory-sections">
        <div className="advisory-section">
          <h3>👥 General Public</h3>
          <p>{data.general}</p>
        </div>

        <div className="advisory-section">
          <h3>⚠️ Sensitive Groups</h3>
          <p>{data.sensitive}</p>
        </div>

        <div className="advisory-section recommendation">
          <h3>💡 Recommendations</h3>
          <p>{data.recommendation}</p>
        </div>
      </div>
    </div>
  );
};

export default HealthAdvisory;