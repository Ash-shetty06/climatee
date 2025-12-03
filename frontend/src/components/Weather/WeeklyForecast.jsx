import React from 'react';
import './Weather.css';

const WeeklyForecast = ({ data }) => {
  if (!data) return null;

  const getDayName = (dateString) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(dateString).getDay()];
  };

  const getWeatherIcon = (code) => {
    if (code <= 3) return '☀️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 95) return '⛈️';
    return '⛅';
  };

  return (
    <div className="weekly-forecast">
      <div className="widget-header">
        <h2 className="widget-title">7-Day Forecast</h2>
      </div>

      <div className="weekly-list">
        {data.time.map((date, index) => (
          <div key={index} className="weekly-item">
            <div className="weekly-day">
              {index === 0 ? 'Today' : getDayName(date)}
            </div>
            <div className="weekly-icon">
              {getWeatherIcon(data.weatherCode?.[index])}
            </div>
            <div className="weekly-temps">
              <span className="temp-max">{Math.round(data.temperatureMax[index])}°</span>
              <span className="temp-min">{Math.round(data.temperatureMin[index])}°</span>
            </div>
            {data.precipitationProbability && (
              <div className="weekly-precip">
                💧 {data.precipitationProbability[index]}%
              </div>
            )}
            {data.uvIndexMax && (
              <div className="weekly-uv">
                ☀️ UV {Math.round(data.uvIndexMax[index])}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;