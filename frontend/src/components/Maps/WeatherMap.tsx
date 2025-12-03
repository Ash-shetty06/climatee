import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Maps.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const WeatherMap = ({ location, weatherData, aqiData }) => {
  if (!location) return null;

  const position = [location.lat, location.lon];

  const getAQIColor = (aqi) => {
    if (!aqi) return '#999';
    if (aqi <= 50) return '#4caf50';
    if (aqi <= 100) return '#ffeb3b';
    if (aqi <= 150) return '#ff9800';
    if (aqi <= 200) return '#f44336';
    if (aqi <= 300) return '#9c27b0';
    return '#b71c1c';
  };

  const aqi = aqiData?.data?.aqi || 0;
  const aqiColor = getAQIColor(aqi);
  const temp = weatherData?.data?.current?.temperature || 'N/A';
  const condition = weatherData?.data?.current?.condition || 'Unknown';

  return (
    <div className="weather-map">
      <div className="widget-header">
        <h2 className="widget-title">🗺️ Interactive Map</h2>
        <div className="map-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{background: '#4caf50'}}></span>
            Good AQI
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{background: '#ffeb3b'}}></span>
            Moderate
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{background: '#f44336'}}></span>
            Unhealthy
          </span>
        </div>
      </div>

      <MapContainer 
        center={position} 
        zoom={10} 
        style={{ height: '500px', width: '100%', borderRadius: '10px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            <div className="map-popup">
              <h3>{location.city}</h3>
              <div className="popup-info">
                <p><strong>🌡️ Temperature:</strong> {temp}°C</p>
                <p><strong>🌤️ Condition:</strong> {condition}</p>
                <p><strong>💨 AQI:</strong> {aqi}</p>
              </div>
            </div>
          </Popup>
        </Marker>

        <Circle
          center={position}
          radius={5000}
          pathOptions={{
            color: aqiColor,
            fillColor: aqiColor,
            fillOpacity: 0.2,
            weight: 2
          }}
        >
          <Popup>
            <strong>Air Quality Zone</strong><br />
            AQI: {aqi}<br />
            Radius: 5km
          </Popup>
        </Circle>
      </MapContainer>

      <div className="map-controls">
        <div className="map-info-card">
          <span className="info-icon">📍</span>
          <div>
            <div className="info-label">Location</div>
            <div className="info-value">{location.city}</div>
          </div>
        </div>
        <div className="map-info-card">
          <span className="info-icon">🌡️</span>
          <div>
            <div className="info-label">Temperature</div>
            <div className="info-value">{temp}°C</div>
          </div>
        </div>
        <div className="map-info-card">
          <span className="info-icon">💨</span>
          <div>
            <div className="info-label">Air Quality</div>
            <div className="info-value" style={{color: aqiColor}}>{aqi} AQI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;