import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Maps.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});
var WeatherMap = _ref => {
  var _aqiData$data, _weatherData$data, _weatherData$data2;
  var {
    location,
    weatherData,
    aqiData
  } = _ref;
  if (!location) return null;
  var position = [location.lat, location.lon];
  var getAQIColor = aqi => {
    if (!aqi) return '#999';
    if (aqi <= 50) return '#4caf50';
    if (aqi <= 100) return '#ffeb3b';
    if (aqi <= 150) return '#ff9800';
    if (aqi <= 200) return '#f44336';
    if (aqi <= 300) return '#9c27b0';
    return '#b71c1c';
  };
  var aqi = (aqiData === null || aqiData === void 0 || (_aqiData$data = aqiData.data) === null || _aqiData$data === void 0 ? void 0 : _aqiData$data.aqi) || 0;
  var aqiColor = getAQIColor(aqi);
  var temp = (weatherData === null || weatherData === void 0 || (_weatherData$data = weatherData.data) === null || _weatherData$data === void 0 || (_weatherData$data = _weatherData$data.current) === null || _weatherData$data === void 0 ? void 0 : _weatherData$data.temperature) || 'N/A';
  var condition = (weatherData === null || weatherData === void 0 || (_weatherData$data2 = weatherData.data) === null || _weatherData$data2 === void 0 || (_weatherData$data2 = _weatherData$data2.current) === null || _weatherData$data2 === void 0 ? void 0 : _weatherData$data2.condition) || 'Unknown';
  return /*#__PURE__*/_jsxs("div", {
    className: "weather-map",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "widget-header",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "widget-title",
        children: "\uD83D\uDDFA\uFE0F Interactive Map"
      }), /*#__PURE__*/_jsxs("div", {
        className: "map-legend",
        children: [/*#__PURE__*/_jsxs("span", {
          className: "legend-item",
          children: [/*#__PURE__*/_jsx("span", {
            className: "legend-dot",
            style: {
              background: '#4caf50'
            }
          }), "Good AQI"]
        }), /*#__PURE__*/_jsxs("span", {
          className: "legend-item",
          children: [/*#__PURE__*/_jsx("span", {
            className: "legend-dot",
            style: {
              background: '#ffeb3b'
            }
          }), "Moderate"]
        }), /*#__PURE__*/_jsxs("span", {
          className: "legend-item",
          children: [/*#__PURE__*/_jsx("span", {
            className: "legend-dot",
            style: {
              background: '#f44336'
            }
          }), "Unhealthy"]
        })]
      })]
    }), /*#__PURE__*/_jsxs(MapContainer, {
      center: position,
      zoom: 10,
      style: {
        height: '500px',
        width: '100%',
        borderRadius: '10px'
      },
      scrollWheelZoom: true,
      children: [/*#__PURE__*/_jsx(TileLayer, {
        attribution: "\xA9 <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a>",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      }), /*#__PURE__*/_jsx(Marker, {
        position: position,
        children: /*#__PURE__*/_jsx(Popup, {
          children: /*#__PURE__*/_jsxs("div", {
            className: "map-popup",
            children: [/*#__PURE__*/_jsx("h3", {
              children: location.city
            }), /*#__PURE__*/_jsxs("div", {
              className: "popup-info",
              children: [/*#__PURE__*/_jsxs("p", {
                children: [/*#__PURE__*/_jsx("strong", {
                  children: "\uD83C\uDF21\uFE0F Temperature:"
                }), " ", temp, "\xB0C"]
              }), /*#__PURE__*/_jsxs("p", {
                children: [/*#__PURE__*/_jsx("strong", {
                  children: "\uD83C\uDF24\uFE0F Condition:"
                }), " ", condition]
              }), /*#__PURE__*/_jsxs("p", {
                children: [/*#__PURE__*/_jsx("strong", {
                  children: "\uD83D\uDCA8 AQI:"
                }), " ", aqi]
              })]
            })]
          })
        })
      }), /*#__PURE__*/_jsx(Circle, {
        center: position,
        radius: 5000,
        pathOptions: {
          color: aqiColor,
          fillColor: aqiColor,
          fillOpacity: 0.2,
          weight: 2
        },
        children: /*#__PURE__*/_jsxs(Popup, {
          children: [/*#__PURE__*/_jsx("strong", {
            children: "Air Quality Zone"
          }), /*#__PURE__*/_jsx("br", {}), "AQI: ", aqi, /*#__PURE__*/_jsx("br", {}), "Radius: 5km"]
        })
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "map-controls",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "map-info-card",
        children: [/*#__PURE__*/_jsx("span", {
          className: "info-icon",
          children: "\uD83D\uDCCD"
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("div", {
            className: "info-label",
            children: "Location"
          }), /*#__PURE__*/_jsx("div", {
            className: "info-value",
            children: location.city
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "map-info-card",
        children: [/*#__PURE__*/_jsx("span", {
          className: "info-icon",
          children: "\uD83C\uDF21\uFE0F"
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("div", {
            className: "info-label",
            children: "Temperature"
          }), /*#__PURE__*/_jsxs("div", {
            className: "info-value",
            children: [temp, "\xB0C"]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "map-info-card",
        children: [/*#__PURE__*/_jsx("span", {
          className: "info-icon",
          children: "\uD83D\uDCA8"
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("div", {
            className: "info-label",
            children: "Air Quality"
          }), /*#__PURE__*/_jsxs("div", {
            className: "info-value",
            style: {
              color: aqiColor
            },
            children: [aqi, " AQI"]
          })]
        })]
      })]
    })]
  });
};
export default WeatherMap;