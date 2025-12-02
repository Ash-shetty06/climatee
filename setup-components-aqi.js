const fs = require('fs');
const path = require('path');

console.log('🚀 Creating AQI components...\n');

const files = {
  'frontend/src/components/AQI/AQIDisplay.jsx': `import React from 'react';
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

export default AQIDisplay;`,

  'frontend/src/components/AQI/PollutantBreakdown.jsx': `import React from 'react';
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
                    width: \`\${Math.min((value / 100) * 100, 100)}%\`,
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

export default PollutantBreakdown;`,

  'frontend/src/components/AQI/HealthAdvisory.jsx': `import React from 'react';
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

export default HealthAdvisory;`,

  'frontend/src/components/AQI/AQI.css': `.aqi-display {
  height: 100%;
}

.aqi-main {
  display: flex;
  align-items: center;
  gap: 30px;
  margin: 20px 0;
}

.aqi-emoji {
  font-size: 5rem;
}

.aqi-info {
  flex: 1;
}

.aqi-value {
  font-size: 4rem;
  font-weight: 700;
}

.aqi-category {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  margin: 10px 0;
}

.aqi-dominant {
  font-size: 1rem;
  color: #666;
  margin-top: 10px;
}

.aqi-station {
  margin-top: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #666;
}

.aqi-timestamp {
  margin-top: 15px;
  font-size: 0.85rem;
  color: #999;
  text-align: center;
}

.pollutants-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.pollutant-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.pollutant-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.pollutant-icon {
  font-size: 1.5rem;
}

.pollutant-name {
  font-weight: 600;
  color: #333;
}

.pollutant-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.pollutant-unit {
  font-size: 0.9rem;
  font-weight: 400;
  color: #666;
}

.pollutant-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.pollutant-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.health-icon {
  font-size: 2rem;
}

.advisory-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.advisory-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.advisory-section.recommendation {
  background: #e8f5e9;
  border-left-color: #4caf50;
}

.advisory-section h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
}

.advisory-section p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .aqi-main {
    flex-direction: column;
    text-align: center;
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
console.log('\n✨ AQI components created!\n');
