import React from 'react';
import './Weather.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var WeeklyForecast = _ref => {
  var {
    data
  } = _ref;
  if (!data) return null;
  var getDayName = dateString => {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(dateString).getDay()];
  };
  var getWeatherIcon = code => {
    if (code <= 3) return '☀️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 95) return '⛈️';
    return '⛅';
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "weekly-forecast",
    children: [/*#__PURE__*/_jsx("div", {
      className: "widget-header",
      children: /*#__PURE__*/_jsx("h2", {
        className: "widget-title",
        children: "7-Day Forecast"
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "weekly-list",
      children: data.time.map((date, index) => {
        var _data$weatherCode;
        return /*#__PURE__*/_jsxs("div", {
          className: "weekly-item",
          children: [/*#__PURE__*/_jsx("div", {
            className: "weekly-day",
            children: index === 0 ? 'Today' : getDayName(date)
          }), /*#__PURE__*/_jsx("div", {
            className: "weekly-icon",
            children: getWeatherIcon((_data$weatherCode = data.weatherCode) === null || _data$weatherCode === void 0 ? void 0 : _data$weatherCode[index])
          }), /*#__PURE__*/_jsxs("div", {
            className: "weekly-temps",
            children: [/*#__PURE__*/_jsxs("span", {
              className: "temp-max",
              children: [Math.round(data.temperatureMax[index]), "\xB0"]
            }), /*#__PURE__*/_jsxs("span", {
              className: "temp-min",
              children: [Math.round(data.temperatureMin[index]), "\xB0"]
            })]
          }), data.precipitationProbability && /*#__PURE__*/_jsxs("div", {
            className: "weekly-precip",
            children: ["\uD83D\uDCA7 ", data.precipitationProbability[index], "%"]
          }), data.uvIndexMax && /*#__PURE__*/_jsxs("div", {
            className: "weekly-uv",
            children: ["\u2600\uFE0F UV ", Math.round(data.uvIndexMax[index])]
          })]
        }, index);
      })
    })]
  });
};
export default WeeklyForecast;