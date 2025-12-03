import React from 'react';
import './Weather.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var WeatherAlerts = _ref => {
  var {
    alerts
  } = _ref;
  if (!alerts || alerts.length === 0) {
    return /*#__PURE__*/_jsxs("div", {
      className: "weather-alerts",
      children: [/*#__PURE__*/_jsx("div", {
        className: "widget-header",
        children: /*#__PURE__*/_jsx("h2", {
          className: "widget-title",
          children: "Weather Alerts"
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "no-alerts",
        children: [/*#__PURE__*/_jsx("span", {
          className: "no-alerts-icon",
          children: "\u2705"
        }), /*#__PURE__*/_jsx("p", {
          children: "No active weather alerts"
        })]
      })]
    });
  }
  var getAlertClass = severity => {
    var classes = {
      'HIGH': 'alert-red',
      'MEDIUM': 'alert-orange',
      'LOW': 'alert-yellow'
    };
    return classes[severity] || 'alert-yellow';
  };
  var getAlertIcon = type => {
    var icons = {
      'HEATWAVE': '🌡️',
      'HEAVY_RAIN': '🌧️',
      'STRONG_WIND': '💨',
      'STORM': '⛈️',
      'COLD': '❄️'
    };
    return icons[type] || '⚠️';
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "weather-alerts",
    children: [/*#__PURE__*/_jsx("div", {
      className: "widget-header",
      children: /*#__PURE__*/_jsx("h2", {
        className: "widget-title",
        children: "Weather Alerts"
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "alerts-list",
      children: alerts.map((alert, index) => /*#__PURE__*/_jsxs("div", {
        className: "alert ".concat(getAlertClass(alert.severity)),
        children: [/*#__PURE__*/_jsx("span", {
          className: "alert-icon",
          children: getAlertIcon(alert.type)
        }), /*#__PURE__*/_jsxs("div", {
          className: "alert-content",
          children: [/*#__PURE__*/_jsx("strong", {
            children: alert.type.replace('_', ' ')
          }), /*#__PURE__*/_jsx("p", {
            children: alert.message
          })]
        })]
      }, index))
    })]
  });
};
export default WeatherAlerts;