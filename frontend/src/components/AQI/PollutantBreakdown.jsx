import React from 'react';
import './AQI.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var PollutantBreakdown = _ref => {
  var {
    data
  } = _ref;
  if (!data) return null;
  var pollutants = [{
    key: 'pm25',
    name: 'PM2.5',
    icon: '💨',
    unit: 'µg/m³',
    color: '#e74c3c'
  }, {
    key: 'pm10',
    name: 'PM10',
    icon: '🌫️',
    unit: 'µg/m³',
    color: '#e67e22'
  }, {
    key: 'no2',
    name: 'NO₂',
    icon: '🏭',
    unit: 'µg/m³',
    color: '#f39c12'
  }, {
    key: 'so2',
    name: 'SO₂',
    icon: '⚗️',
    unit: 'µg/m³',
    color: '#9b59b6'
  }, {
    key: 'co',
    name: 'CO',
    icon: '🚗',
    unit: 'µg/m³',
    color: '#34495e'
  }, {
    key: 'o3',
    name: 'O₃',
    icon: '☀️',
    unit: 'µg/m³',
    color: '#3498db'
  }];
  return /*#__PURE__*/_jsxs("div", {
    className: "pollutant-breakdown",
    children: [/*#__PURE__*/_jsx("div", {
      className: "widget-header",
      children: /*#__PURE__*/_jsx("h2", {
        className: "widget-title",
        children: "Pollutant Levels"
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "pollutants-list",
      children: pollutants.map(pollutant => {
        var value = data[pollutant.key];
        if (value === null || value === undefined) return null;
        return /*#__PURE__*/_jsxs("div", {
          className: "pollutant-item",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "pollutant-header",
            children: [/*#__PURE__*/_jsx("span", {
              className: "pollutant-icon",
              children: pollutant.icon
            }), /*#__PURE__*/_jsx("span", {
              className: "pollutant-name",
              children: pollutant.name
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "pollutant-value",
            style: {
              color: pollutant.color
            },
            children: [value.toFixed(1), " ", /*#__PURE__*/_jsx("span", {
              className: "pollutant-unit",
              children: pollutant.unit
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "pollutant-bar",
            children: /*#__PURE__*/_jsx("div", {
              className: "pollutant-fill",
              style: {
                width: "".concat(Math.min(value / 100 * 100, 100), "%"),
                background: pollutant.color
              }
            })
          })]
        }, pollutant.key);
      })
    })]
  });
};
export default PollutantBreakdown;