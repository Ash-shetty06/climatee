function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import React, { useState, useEffect } from 'react';
import { climateAPI } from '../../services/api';
import LineChart from '../Charts/LineChart';
import Loader from '../Common/Loader';
import './Climate.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var ClimateProjections = _ref => {
  var {
    location
  } = _ref;
  var [data, setData] = useState(null);
  var [loading, setLoading] = useState(false);
  var [scenario, setScenario] = useState('RCP4.5');
  useEffect(() => {
    if (location) {
      fetchProjections();
    }
  }, [location, scenario]);
  var fetchProjections = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* () {
      setLoading(true);
      try {
        var response = yield climateAPI.getProjections(location.lat, location.lon, scenario);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch projections:', err);
      } finally {
        setLoading(false);
      }
    });
    return function fetchProjections() {
      return _ref2.apply(this, arguments);
    };
  }();
  if (loading) return /*#__PURE__*/_jsx(Loader, {
    message: "Loading climate projections..."
  });
  if (!data) return null;
  var projections = data.data;
  var chartData = projections.years.map((year, idx) => ({
    year: year,
    temperature: projections.projectedTemperature[idx],
    precipitation: projections.projectedPrecipitation[idx]
  }));
  return /*#__PURE__*/_jsxs("div", {
    className: "climate-projections",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "widget-header",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "widget-title",
        children: "\uD83D\uDD2E Climate Projections (2025-2100)"
      }), /*#__PURE__*/_jsx("div", {
        className: "scenario-selector",
        children: /*#__PURE__*/_jsxs("select", {
          value: scenario,
          onChange: e => setScenario(e.target.value),
          children: [/*#__PURE__*/_jsx("option", {
            value: "RCP2.6",
            children: "RCP 2.6 (Low Emissions)"
          }), /*#__PURE__*/_jsx("option", {
            value: "RCP4.5",
            children: "RCP 4.5 (Moderate)"
          }), /*#__PURE__*/_jsx("option", {
            value: "RCP6.0",
            children: "RCP 6.0 (High)"
          }), /*#__PURE__*/_jsx("option", {
            value: "RCP8.5",
            children: "RCP 8.5 (Very High)"
          })]
        })
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "projection-info",
      children: [/*#__PURE__*/_jsxs("p", {
        children: ["Scenario: ", /*#__PURE__*/_jsx("strong", {
          children: projections.scenario
        })]
      }), /*#__PURE__*/_jsx("p", {
        children: "Based on IPCC climate models"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "climate-charts",
      children: [/*#__PURE__*/_jsx(LineChart, {
        data: chartData,
        xKey: "year",
        yKeys: ["temperature"],
        colors: ["#e74c3c"],
        title: "Projected Temperature Change (\xB0C)",
        height: 300
      }), /*#__PURE__*/_jsx(LineChart, {
        data: chartData,
        xKey: "year",
        yKeys: ["precipitation"],
        colors: ["#3498db"],
        title: "Projected Precipitation Change (mm)",
        height: 300
      })]
    }), projections.impacts && projections.impacts.length > 0 && /*#__PURE__*/_jsxs("div", {
      className: "climate-impacts",
      children: [/*#__PURE__*/_jsx("h3", {
        children: "\uD83C\uDF0D Expected Impacts"
      }), /*#__PURE__*/_jsx("div", {
        className: "impacts-list",
        children: projections.impacts.map((impact, idx) => /*#__PURE__*/_jsxs("div", {
          className: "impact-item severity-".concat(impact.severity.toLowerCase()),
          children: [/*#__PURE__*/_jsx("strong", {
            children: impact.category.replace('_', ' ')
          }), /*#__PURE__*/_jsx("p", {
            children: impact.description
          }), /*#__PURE__*/_jsx("span", {
            className: "impact-severity",
            children: impact.severity
          })]
        }, idx))
      })]
    })]
  });
};
export default ClimateProjections;