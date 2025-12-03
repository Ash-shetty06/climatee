import React from 'react';
import './Weather.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var CurrentWeather = _ref => {
  var {
    data,
    location
  } = _ref;
  if (!data || !data.data) return null;
  var current = data.data.current;
  var getWeatherIcon = condition => {
    var icons = {
      'clear': '☀️',
      'partly': '⛅',
      'cloud': '☁️',
      'rain': '🌧️',
      'storm': '⛈️',
      'snow': '🌨️',
      'fog': '🌫️'
    };
    var conditionLower = (condition || '').toLowerCase();
    for (var key in icons) {
      if (conditionLower.includes(key)) return icons[key];
    }
    return '🌤️';
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "current-weather",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "widget-header",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "widget-title",
        children: "Current Weather"
      }), /*#__PURE__*/_jsxs("span", {
        className: "location-badge",
        children: ["\uD83D\uDCCD ", location.city]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "weather-main",
      children: [/*#__PURE__*/_jsx("div", {
        className: "weather-icon-large",
        children: getWeatherIcon(current.condition)
      }), /*#__PURE__*/_jsxs("div", {
        className: "weather-temp",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "temp-value",
          children: [Math.round(current.temperature), "\xB0C"]
        }), /*#__PURE__*/_jsxs("div", {
          className: "temp-feels",
          children: ["Feels like ", Math.round(current.feelsLike), "\xB0C"]
        }), /*#__PURE__*/_jsx("div", {
          className: "weather-condition",
          children: current.condition
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "weather-details-grid",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "detail-item",
        children: [/*#__PURE__*/_jsx("span", {
          className: "detail-icon",
          children: "\uD83D\uDCA7"
        }), /*#__PURE__*/_jsx("span", {
          className: "detail-label",
          children: "Humidity"
        }), /*#__PURE__*/_jsxs("span", {
          className: "detail-value",
          children: [current.humidity, "%"]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "detail-item",
        children: [/*#__PURE__*/_jsx("span", {
          className: "detail-icon",
          children: "\uD83D\uDCA8"
        }), /*#__PURE__*/_jsx("span", {
          className: "detail-label",
          children: "Wind"
        }), /*#__PURE__*/_jsxs("span", {
          className: "detail-value",
          children: [current.windSpeed, " km/h"]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "detail-item",
        children: [/*#__PURE__*/_jsx("span", {
          className: "detail-icon",
          children: "\uD83C\uDF21\uFE0F"
        }), /*#__PURE__*/_jsx("span", {
          className: "detail-label",
          children: "Pressure"
        }), /*#__PURE__*/_jsxs("span", {
          className: "detail-value",
          children: [current.pressure, " mb"]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "detail-item",
        children: [/*#__PURE__*/_jsx("span", {
          className: "detail-icon",
          children: "\u2601\uFE0F"
        }), /*#__PURE__*/_jsx("span", {
          className: "detail-label",
          children: "Cloud Cover"
        }), /*#__PURE__*/_jsxs("span", {
          className: "detail-value",
          children: [current.cloudCover, "%"]
        })]
      }), current.uvIndex && /*#__PURE__*/_jsxs("div", {
        className: "detail-item",
        children: [/*#__PURE__*/_jsx("span", {
          className: "detail-icon",
          children: "\u2600\uFE0F"
        }), /*#__PURE__*/_jsx("span", {
          className: "detail-label",
          children: "UV Index"
        }), /*#__PURE__*/_jsx("span", {
          className: "detail-value",
          children: current.uvIndex
        })]
      }), current.visibility && /*#__PURE__*/_jsxs("div", {
        className: "detail-item",
        children: [/*#__PURE__*/_jsx("span", {
          className: "detail-icon",
          children: "\uD83D\uDC41\uFE0F"
        }), /*#__PURE__*/_jsx("span", {
          className: "detail-label",
          children: "Visibility"
        }), /*#__PURE__*/_jsxs("span", {
          className: "detail-value",
          children: [current.visibility, " km"]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "timestamp",
      children: ["Last updated: ", new Date(current.timestamp).toLocaleString()]
    })]
  });
};
export default CurrentWeather;