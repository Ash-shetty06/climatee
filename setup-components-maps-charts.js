const fs = require('fs');
const path = require('path');

console.log('🚀 Creating Maps & Charts components (FINAL)...\n');

const files = {
  'frontend/src/components/Maps/WeatherMap.jsx': `import React from 'react';
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

export default WeatherMap;`,

  'frontend/src/components/Maps/Maps.css': `.weather-map {
  width: 100%;
}

.map-legend {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #666;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.map-popup h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.1rem;
}

.popup-info p {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #555;
}

.map-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.map-info-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.info-icon {
  font-size: 2rem;
}

.info-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

.info-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.leaflet-container {
  font-family: inherit;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
}

@media (max-width: 768px) {
  .map-legend {
    font-size: 0.8rem;
  }

  .map-controls {
    grid-template-columns: 1fr;
  }
}`,

  'frontend/src/components/Charts/LineChart.jsx': `import React from 'react';
import Chart from 'react-apexcharts';

const LineChart = ({ data, xKey, yKeys, colors, title, height = 300 }) => {
  if (!data || data.length === 0) return null;

  const series = yKeys.map((key, index) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    data: data.map(item => item[key])
  }));

  const options = {
    chart: {
      type: 'line',
      height,
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: true,
          pan: true
        }
      },
      animations: {
        enabled: true,
        speed: 800
      }
    },
    colors: colors || ['#667eea', '#764ba2'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: data.map(item => item[xKey]),
      labels: {
        rotate: -45,
        style: {
          fontSize: '11px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false
    },
    legend: {
      show: true,
      position: 'top'
    },
    grid: {
      borderColor: '#f0f0f0',
      strokeDashArray: 4
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#333'
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <Chart options={options} series={series} type="line" height={height} />
    </div>
  );
};

export default LineChart;`,

  'frontend/src/components/Charts/BarChart.jsx': `import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ data, xKey, yKey, color = '#667eea', title, height = 300 }) => {
  if (!data || data.length === 0) return null;

  const series = [{
    name: yKey,
    data: data.map(item => item[yKey])
  }];

  const options = {
    chart: {
      type: 'bar',
      height,
      toolbar: {
        show: true
      }
    },
    colors: [color],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: data.map(item => item[xKey]),
      labels: {
        style: {
          fontSize: '11px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => val.toFixed(1)
      }
    },
    grid: {
      borderColor: '#f0f0f0'
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#333'
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <Chart options={options} series={series} type="bar" height={height} />
    </div>
  );
};

export default BarChart;`,

  'frontend/src/components/Charts/DonutChart.jsx': `import React from 'react';
import Chart from 'react-apexcharts';

const DonutChart = ({ data, labels, colors, title, height = 300 }) => {
  if (!data || data.length === 0) return null;

  const options = {
    chart: {
      type: 'donut',
      height
    },
    labels: labels,
    colors: colors || ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
    legend: {
      position: 'bottom',
      fontSize: '12px'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + '%';
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%'
        }
      }
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#333'
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <Chart options={options} series={data} type="donut" height={height} />
    </div>
  );
};

export default DonutChart;`
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

console.log('\n✨ Maps & Charts components created!\n');
console.log('\n🎉🎉🎉 CONGRATULATIONS! 🎉🎉🎉');
console.log('\n✅ ALL FILES CREATED SUCCESSFULLY!\n');
console.log('📁 Project Structure:');
console.log('  ✅ Backend - Complete (Models, Services, Routes, Middleware)');
console.log('  ✅ Frontend - Complete (All Components, Hooks, Services)');
console.log('\n📝 Next Steps:');
console.log('1. cd backend && npm install');
console.log('2. cd ../frontend && npm install');
console.log('3. Start MongoDB: mongod');
console.log('4. Start Backend: cd backend && npm run dev');
console.log('5. Start Frontend: cd frontend && npm run dev');
console.log('\n🚀 Your Weather Intelligence Platform is ready to launch!');
