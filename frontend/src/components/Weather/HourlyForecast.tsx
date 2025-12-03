import React from 'react';
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

export default HourlyForecast;