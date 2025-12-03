import React from 'react';
import './Weather.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var HourlyForecast = _ref => {
  var {
    data
  } = _ref;
  if (!data) return null;
  return /*#__PURE__*/_jsxs("div", {
    className: "hourly-forecast",
    children: [/*#__PURE__*/_jsx("div", {
      className: "widget-header",
      children: /*#__PURE__*/_jsx("h2", {
        className: "widget-title",
        children: "48-Hour Forecast"
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "hourly-scroll",
      children: data.time.slice(0, 48).map((time, index) => {
        var _data$precipitationPr;
        var hour = new Date(time).getHours();
        var temp = Math.round(data.temperature[index]);
        var precip = ((_data$precipitationPr = data.precipitationProbability) === null || _data$precipitationPr === void 0 ? void 0 : _data$precipitationPr[index]) || 0;
        return /*#__PURE__*/_jsxs("div", {
          className: "hourly-item",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "hourly-time",
            children: [hour, ":00"]
          }), /*#__PURE__*/_jsx("div", {
            className: "hourly-icon",
            children: precip > 50 ? '🌧️' : temp > 30 ? '☀️' : '⛅'
          }), /*#__PURE__*/_jsxs("div", {
            className: "hourly-temp",
            children: [temp, "\xB0"]
          }), precip > 0 && /*#__PURE__*/_jsxs("div", {
            className: "hourly-precip",
            children: ["\uD83D\uDCA7 ", precip, "%"]
          })]
        }, index);
      })
    })]
  });
};
export default HourlyForecast;