import React, { useState, useEffect } from 'react';
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
              <div key={idx} className={`impact-item severity-${impact.severity.toLowerCase()}`}>
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

export default ClimateProjections;