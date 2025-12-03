import React from 'react';
import './Weather.css';

const WeatherAlerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="weather-alerts">
        <div className="widget-header">
          <h2 className="widget-title">Weather Alerts</h2>
        </div>
        <div className="no-alerts">
          <span className="no-alerts-icon">✅</span>
          <p>No active weather alerts</p>
        </div>
      </div>
    );
  }

  const getAlertClass = (severity) => {
    const classes = {
      'HIGH': 'alert-red',
      'MEDIUM': 'alert-orange',
      'LOW': 'alert-yellow'
    };
    return classes[severity] || 'alert-yellow';
  };

  const getAlertIcon = (type) => {
    const icons = {
      'HEATWAVE': '🌡️',
      'HEAVY_RAIN': '🌧️',
      'STRONG_WIND': '💨',
      'STORM': '⛈️',
      'COLD': '❄️'
    };
    return icons[type] || '⚠️';
  };

  return (
    <div className="weather-alerts">
      <div className="widget-header">
        <h2 className="widget-title">Weather Alerts</h2>
      </div>

      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <div key={index} className={`alert ${getAlertClass(alert.severity)}`}>
            <span className="alert-icon">{getAlertIcon(alert.type)}</span>
            <div className="alert-content">
              <strong>{alert.type.replace('_', ' ')}</strong>
              <p>{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAlerts;