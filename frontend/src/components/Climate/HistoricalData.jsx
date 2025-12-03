import React, { useState, useEffect } from 'react';
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

export default HistoricalData;