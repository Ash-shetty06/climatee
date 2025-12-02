const fs = require('fs');
const path = require('path');

console.log('🚀 Creating Climate & Agriculture components...\n');

const files = {
  'frontend/src/components/Climate/HistoricalData.jsx': `import React, { useState, useEffect } from 'react';
import { climateAPI } from '../../services/api';
import LineChart from '../Charts/LineChart';
import Loader from '../Common/Loader';
import './Climate.css';

const HistoricalData = ({ location }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('1year');

  useEffect(() => {
    if (location) {
      fetchHistoricalData();
    }
  }, [location, dateRange]);

  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      
      if (dateRange === '1year') startDate.setFullYear(startDate.getFullYear() - 1);
      else if (dateRange === '5years') startDate.setFullYear(startDate.getFullYear() - 5);
      else if (dateRange === '10years') startDate.setFullYear(startDate.getFullYear() - 10);
      
      const response = await climateAPI.getHistorical(
        location.lat,
        location.lon,
        startDate.toISOString().split('T')[0],
        endDate,
        location.city
      );

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch historical data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading historical climate data..." />;
  if (!data) return null;

  const chartData = data.data.timeSeries.dates.map((date, idx) => ({
    date: date,
    temperature: data.data.timeSeries.temperatureMean[idx],
    precipitation: data.data.timeSeries.precipitation[idx]
  })).filter(item => item.temperature !== null);

  return (
    <div className="historical-data">
      <div className="widget-header">
        <h2 className="widget-title">📊 Historical Climate Data</h2>
        <div className="date-range-selector">
          <button 
            className={dateRange === '1year' ? 'active' : ''}
            onClick={() => setDateRange('1year')}
          >
            1 Year
          </button>
          <button 
            className={dateRange === '5years' ? 'active' : ''}
            onClick={() => setDateRange('5years')}
          >
            5 Years
          </button>
          <button 
            className={dateRange === '10years' ? 'active' : ''}
            onClick={() => setDateRange('10years')}
          >
            10 Years
          </button>
        </div>
      </div>

      <div className="climate-charts">
        <LineChart
          data={chartData}
          xKey="date"
          yKeys={["temperature"]}
          colors={["#e74c3c"]}
          title="Temperature Trend (°C)"
          height={300}
        />

        <LineChart
          data={chartData}
          xKey="date"
          yKeys={["precipitation"]}
          colors={["#3498db"]}
          title="Precipitation Trend (mm)"
          height={300}
        />
      </div>

      {data.data.anomalies && data.data.anomalies.length > 0 && (
        <div className="climate-anomalies">
          <h3>⚠️ Detected Anomalies</h3>
          <div className="anomalies-list">
            {data.data.anomalies.slice(0, 5).map((anomaly, idx) => (
              <div key={idx} className="anomaly-item">
                <span className="anomaly-date">{anomaly.date}</span>
                <span className="anomaly-type">{anomaly.type.replace('_', ' ')}</span>
                <span className="anomaly-severity">{anomaly.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalData;`,

  'frontend/src/components/Climate/ClimateProjections.jsx': `import React, { useState, useEffect } from 'react';
import { climateAPI } from '../../services/api';
import LineChart from '../Charts/LineChart';
import Loader from '../Common/Loader';
import './Climate.css';

const ClimateProjections = ({ location }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState('RCP4.5');

  useEffect(() => {
    if (location) {
      fetchProjections();
    }
  }, [location, scenario]);

  const fetchProjections = async () => {
    setLoading(true);
    try {
      const response = await climateAPI.getProjections(
        location.lat,
        location.lon,
        scenario
      );

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch projections:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading climate projections..." />;
  if (!data) return null;

  const projections = data.data;
  const chartData = projections.years.map((year, idx) => ({
    year: year,
    temperature: projections.projectedTemperature[idx],
    precipitation: projections.projectedPrecipitation[idx]
  }));

  return (
    <div className="climate-projections">
      <div className="widget-header">
        <h2 className="widget-title">🔮 Climate Projections (2025-2100)</h2>
        <div className="scenario-selector">
          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            <option value="RCP2.6">RCP 2.6 (Low Emissions)</option>
            <option value="RCP4.5">RCP 4.5 (Moderate)</option>
            <option value="RCP6.0">RCP 6.0 (High)</option>
            <option value="RCP8.5">RCP 8.5 (Very High)</option>
          </select>
        </div>
      </div>

      <div className="projection-info">
        <p>Scenario: <strong>{projections.scenario}</strong></p>
        <p>Based on IPCC climate models</p>
      </div>

      <div className="climate-charts">
        <LineChart
          data={chartData}
          xKey="year"
          yKeys={["temperature"]}
          colors={["#e74c3c"]}
          title="Projected Temperature Change (°C)"
          height={300}
        />

        <LineChart
          data={chartData}
          xKey="year"
          yKeys={["precipitation"]}
          colors={["#3498db"]}
          title="Projected Precipitation Change (mm)"
          height={300}
        />
      </div>

      {projections.impacts && projections.impacts.length > 0 && (
        <div className="climate-impacts">
          <h3>🌍 Expected Impacts</h3>
          <div className="impacts-list">
            {projections.impacts.map((impact, idx) => (
              <div key={idx} className={\`impact-item severity-\${impact.severity.toLowerCase()}\`}>
                <strong>{impact.category.replace('_', ' ')}</strong>
                <p>{impact.description}</p>
                <span className="impact-severity">{impact.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClimateProjections;`,

  'frontend/src/components/Climate/Climate.css': `.date-range-selector button,
.scenario-selector select {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-range-selector {
  display: flex;
  gap: 10px;
}

.date-range-selector button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.scenario-selector select {
  font-size: 0.9rem;
}

.climate-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.projection-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
}

.projection-info p {
  margin: 5px 0;
  color: #666;
}

.climate-anomalies,
.climate-impacts {
  margin-top: 30px;
}

.climate-anomalies h3,
.climate-impacts h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
}

.anomalies-list,
.impacts-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.anomaly-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: #fff3cd;
  border-radius: 6px;
  border-left: 4px solid #ffc107;
}

.anomaly-date {
  font-weight: 600;
}

.anomaly-type {
  color: #666;
  text-transform: capitalize;
}

.anomaly-severity {
  padding: 4px 12px;
  background: #ffc107;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.impact-item {
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #ff9800;
}

.impact-item.severity-high {
  background: #ffebee;
  border-left-color: #f44336;
}

.impact-item.severity-critical {
  background: #f3e5f5;
  border-left-color: #9c27b0;
}

.impact-item strong {
  display: block;
  margin-bottom: 5px;
  text-transform: capitalize;
}

.impact-item p {
  margin: 5px 0;
  color: #555;
}

.impact-severity {
  display: inline-block;
  padding: 4px 12px;
  background: white;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .climate-charts {
    grid-template-columns: 1fr;
  }
}`,

  'frontend/src/components/Agriculture/CropRecommendations.jsx': `import React, { useState, useEffect } from 'react';
import { agricultureAPI } from '../../services/api';
import Loader from '../Common/Loader';
import './Agriculture.css';

const CropRecommendations = ({ location, weatherData }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [soilType, setSoilType] = useState('loam');

  useEffect(() => {
    if (weatherData) {
      fetchRecommendations();
    }
  }, [location, soilType, weatherData]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await agricultureAPI.getRecommendations(
        location.lat,
        location.lon,
        location.city,
        soilType
      );

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch agriculture data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Analyzing crop suitability..." />;
  if (!data) return null;

  const recommendations = data.data.recommendedCrops || [];
  const alerts = data.data.alerts || [];

  const getRecommendationColor = (level) => {
    const colors = {
      'HIGHLY_RECOMMENDED': '#4caf50',
      'RECOMMENDED': '#8bc34a',
      'SUITABLE': '#ffc107'
    };
    return colors[level] || '#999';
  };

  return (
    <div className="crop-recommendations">
      <div className="widget-header">
        <h2 className="widget-title">🌾 Crop Recommendations</h2>
        <div className="soil-selector">
          <label>Soil Type:</label>
          <select value={soilType} onChange={(e) => setSoilType(e.target.value)}>
            <option value="loam">Loam</option>
            <option value="clay">Clay</option>
            <option value="sandy-loam">Sandy Loam</option>
            <option value="clay-loam">Clay Loam</option>
            <option value="sandy">Sandy</option>
          </select>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="agriculture-alerts">
          <h3>⚠️ Agriculture Alerts</h3>
          {alerts.map((alert, index) => (
            <div key={index} className={\`ag-alert \${alert.severity.toLowerCase()}\`}>
              <strong>{alert.type.replace('_', ' ')}</strong>
              <p>{alert.message}</p>
              <div className="ag-recommendations">
                <strong>Recommendations:</strong>
                <ul>
                  {alert.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="crops-grid">
        {recommendations.map((crop, index) => (
          <div 
            key={index} 
            className="crop-card"
            style={{ borderTopColor: getRecommendationColor(crop.recommendation) }}
          >
            <div className="crop-header">
              <h4>{crop.name}</h4>
              <p className="crop-scientific">{crop.scientificName}</p>
            </div>

            <div className="suitability-score">
              <div className="score-bar">
                <div 
                  className="score-fill"
                  style={{ 
                    width: \`\${crop.suitabilityScore}%\`,
                    background: getRecommendationColor(crop.recommendation)
                  }}
                ></div>
              </div>
              <div className="score-value">{crop.suitabilityScore.toFixed(0)}%</div>
            </div>

            <div 
              className="recommendation-badge"
              style={{ background: getRecommendationColor(crop.recommendation) }}
            >
              {crop.recommendation.replace('_', ' ')}
            </div>

            <div className="crop-details">
              <p>📅 {crop.growingPeriod}</p>
              <p>🗓️ {crop.season}</p>
              <p>🏷️ {crop.category}</p>
            </div>

            {crop.reasons && crop.reasons.length > 0 && (
              <div className="crop-reasons">
                <strong>Why suitable:</strong>
                <ul>
                  {crop.reasons.map((reason, i) => (
                    <li key={i}>✓ {reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropRecommendations;`,

  'frontend/src/components/Agriculture/Agriculture.css': `.soil-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.soil-selector select {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.agriculture-alerts {
  margin: 20px 0;
}

.ag-alert {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border-left: 4px solid #ff9800;
  background: #fff3e0;
}

.ag-alert.high {
  border-left-color: #f44336;
  background: #ffebee;
}

.ag-recommendations ul {
  margin: 10px 0;
  padding-left: 20px;
}

.crops-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.crop-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border-top: 4px solid #4caf50;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
}

.crop-card:hover {
  transform: translateY(-5px);
}

.crop-header h4 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 5px;
}

.crop-scientific {
  font-size: 0.9rem;
  color: #999;
  font-style: italic;
}

.suitability-score {
  margin: 15px 0;
}

.score-bar {
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 5px;
}

.score-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.score-value {
  text-align: right;
  font-weight: 600;
  color: #333;
}

.recommendation-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 10px 0;
  text-transform: capitalize;
}

.crop-details p {
  margin: 5px 0;
  color: #666;
}

.crop-reasons {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid #f0f0f0;
}

.crop-reasons ul {
  margin: 10px 0;
  padding: 0;
  list-style: none;
}

.crop-reasons li {
  padding: 5px 0;
  color: #555;
  font-size: 0.9rem;
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
console.log('\n✨ Climate & Agriculture components created!\n');
