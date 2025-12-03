function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import React, { useState, useEffect } from 'react';
import { agricultureAPI } from '../../services/api';
import Loader from '../Common/Loader';
import './Agriculture.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var CropRecommendations = _ref => {
  var {
    location,
    weatherData
  } = _ref;
  var [data, setData] = useState(null);
  var [loading, setLoading] = useState(false);
  var [soilType, setSoilType] = useState('loam');
  useEffect(() => {
    if (weatherData) {
      fetchRecommendations();
    }
  }, [location, soilType, weatherData]);
  var fetchRecommendations = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* () {
      setLoading(true);
      try {
        var response = yield agricultureAPI.getRecommendations(location.lat, location.lon, location.city, soilType);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch agriculture data:', err);
      } finally {
        setLoading(false);
      }
    });
    return function fetchRecommendations() {
      return _ref2.apply(this, arguments);
    };
  }();
  if (loading) return /*#__PURE__*/_jsx(Loader, {
    message: "Analyzing crop suitability..."
  });
  if (!data) return null;
  var recommendations = data.data.recommendedCrops || [];
  var alerts = data.data.alerts || [];
  var getRecommendationColor = level => {
    var colors = {
      'HIGHLY_RECOMMENDED': '#4caf50',
      'RECOMMENDED': '#8bc34a',
      'SUITABLE': '#ffc107'
    };
    return colors[level] || '#999';
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "crop-recommendations",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "widget-header",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "widget-title",
        children: "\uD83C\uDF3E Crop Recommendations"
      }), /*#__PURE__*/_jsxs("div", {
        className: "soil-selector",
        children: [/*#__PURE__*/_jsx("label", {
          children: "Soil Type:"
        }), /*#__PURE__*/_jsxs("select", {
          value: soilType,
          onChange: e => setSoilType(e.target.value),
          children: [/*#__PURE__*/_jsx("option", {
            value: "loam",
            children: "Loam"
          }), /*#__PURE__*/_jsx("option", {
            value: "clay",
            children: "Clay"
          }), /*#__PURE__*/_jsx("option", {
            value: "sandy-loam",
            children: "Sandy Loam"
          }), /*#__PURE__*/_jsx("option", {
            value: "clay-loam",
            children: "Clay Loam"
          }), /*#__PURE__*/_jsx("option", {
            value: "sandy",
            children: "Sandy"
          })]
        })]
      })]
    }), alerts.length > 0 && /*#__PURE__*/_jsxs("div", {
      className: "agriculture-alerts",
      children: [/*#__PURE__*/_jsx("h3", {
        children: "\u26A0\uFE0F Agriculture Alerts"
      }), alerts.map((alert, index) => /*#__PURE__*/_jsxs("div", {
        className: "ag-alert ".concat(alert.severity.toLowerCase()),
        children: [/*#__PURE__*/_jsx("strong", {
          children: alert.type.replace('_', ' ')
        }), /*#__PURE__*/_jsx("p", {
          children: alert.message
        }), /*#__PURE__*/_jsxs("div", {
          className: "ag-recommendations",
          children: [/*#__PURE__*/_jsx("strong", {
            children: "Recommendations:"
          }), /*#__PURE__*/_jsx("ul", {
            children: alert.recommendations.map((rec, i) => /*#__PURE__*/_jsx("li", {
              children: rec
            }, i))
          })]
        })]
      }, index))]
    }), /*#__PURE__*/_jsx("div", {
      className: "crops-grid",
      children: recommendations.map((crop, index) => /*#__PURE__*/_jsxs("div", {
        className: "crop-card",
        style: {
          borderTopColor: getRecommendationColor(crop.recommendation)
        },
        children: [/*#__PURE__*/_jsxs("div", {
          className: "crop-header",
          children: [/*#__PURE__*/_jsx("h4", {
            children: crop.name
          }), /*#__PURE__*/_jsx("p", {
            className: "crop-scientific",
            children: crop.scientificName
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "suitability-score",
          children: [/*#__PURE__*/_jsx("div", {
            className: "score-bar",
            children: /*#__PURE__*/_jsx("div", {
              className: "score-fill",
              style: {
                width: "".concat(crop.suitabilityScore, "%"),
                background: getRecommendationColor(crop.recommendation)
              }
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "score-value",
            children: [crop.suitabilityScore.toFixed(0), "%"]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "recommendation-badge",
          style: {
            background: getRecommendationColor(crop.recommendation)
          },
          children: crop.recommendation.replace('_', ' ')
        }), /*#__PURE__*/_jsxs("div", {
          className: "crop-details",
          children: [/*#__PURE__*/_jsxs("p", {
            children: ["\uD83D\uDCC5 ", crop.growingPeriod]
          }), /*#__PURE__*/_jsxs("p", {
            children: ["\uD83D\uDDD3\uFE0F ", crop.season]
          }), /*#__PURE__*/_jsxs("p", {
            children: ["\uD83C\uDFF7\uFE0F ", crop.category]
          })]
        }), crop.reasons && crop.reasons.length > 0 && /*#__PURE__*/_jsxs("div", {
          className: "crop-reasons",
          children: [/*#__PURE__*/_jsx("strong", {
            children: "Why suitable:"
          }), /*#__PURE__*/_jsx("ul", {
            children: crop.reasons.map((reason, i) => /*#__PURE__*/_jsxs("li", {
              children: ["\u2713 ", reason]
            }, i))
          })]
        })]
      }, index))
    })]
  });
};
export default CropRecommendations;