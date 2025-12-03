import React from 'react';
import './AQI.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var HealthAdvisory = _ref => {
  var {
    data,
    aqi
  } = _ref;
  if (!data) return null;
  var getHealthIcon = aqi => {
    if (aqi <= 50) return '💚';
    if (aqi <= 100) return '💛';
    if (aqi <= 150) return '🧡';
    if (aqi <= 200) return '❤️';
    return '💜';
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "health-advisory",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "widget-header",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "widget-title",
        children: "Health Advisory"
      }), /*#__PURE__*/_jsx("span", {
        className: "health-icon",
        children: getHealthIcon(aqi)
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "advisory-sections",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "advisory-section",
        children: [/*#__PURE__*/_jsx("h3", {
          children: "\uD83D\uDC65 General Public"
        }), /*#__PURE__*/_jsx("p", {
          children: data.general
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "advisory-section",
        children: [/*#__PURE__*/_jsx("h3", {
          children: "\u26A0\uFE0F Sensitive Groups"
        }), /*#__PURE__*/_jsx("p", {
          children: data.sensitive
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "advisory-section recommendation",
        children: [/*#__PURE__*/_jsx("h3", {
          children: "\uD83D\uDCA1 Recommendations"
        }), /*#__PURE__*/_jsx("p", {
          children: data.recommendation
        })]
      })]
    })]
  });
};
export default HealthAdvisory;