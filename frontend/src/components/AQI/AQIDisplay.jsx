import React from 'react';
import './AQI.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var AQIDisplay = _ref => {
  var _aqiData$station;
  var {
    data
  } = _ref;
  if (!data || !data.data) return null;
  var aqiData = data.data;
  var aqi = aqiData.aqi;
  var category = aqiData.category;
  var getAQIEmoji = aqi => {
    if (aqi <= 50) return '😊';
    if (aqi <= 100) return '😐';
    if (aqi <= 150) return '😷';
    if (aqi <= 200) return '😨';
    return '☠️';
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "aqi-display",
    children: [/*#__PURE__*/_jsx("div", {
      className: "widget-header",
      children: /*#__PURE__*/_jsx("h2", {
        className: "widget-title",
        children: "Air Quality Index"
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "aqi-main",
      children: [/*#__PURE__*/_jsx("div", {
        className: "aqi-emoji",
        children: getAQIEmoji(aqi)
      }), /*#__PURE__*/_jsxs("div", {
        className: "aqi-info",
        children: [/*#__PURE__*/_jsx("div", {
          className: "aqi-value",
          style: {
            color: category.color
          },
          children: aqi
        }), /*#__PURE__*/_jsx("div", {
          className: "aqi-category",
          style: {
            background: category.color
          },
          children: category.level
        }), /*#__PURE__*/_jsxs("div", {
          className: "aqi-dominant",
          children: ["Main Pollutant: ", aqiData.dominantPollutant]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "aqi-station",
      children: ["\uD83D\uDCCD Station: ", ((_aqiData$station = aqiData.station) === null || _aqiData$station === void 0 ? void 0 : _aqiData$station.name) || 'Unknown']
    }), /*#__PURE__*/_jsxs("div", {
      className: "aqi-timestamp",
      children: ["Last updated: ", new Date(aqiData.timestamp).toLocaleString()]
    })]
  });
};
export default AQIDisplay;