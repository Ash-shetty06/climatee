import React, { useState, useEffect } from 'react';
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
            <div key={index} className={`ag-alert ${alert.severity.toLowerCase()}`}>
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
                    width: `${crop.suitabilityScore}%`,
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

export default CropRecommendations;