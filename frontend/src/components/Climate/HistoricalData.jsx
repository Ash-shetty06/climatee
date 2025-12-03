function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import React, { useState, useEffect } from 'react';
import { climateAPI } from '../../services/api';
import LineChart from '../Charts/LineChart';
import Loader from '../Common/Loader';
import './Climate.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var HistoricalData = _ref => {
  var {
    location
  } = _ref;
  var [data, setData] = useState(null);
  var [loading, setLoading] = useState(false);
  var [dateRange, setDateRange] = useState('1year');
  useEffect(() => {
    if (location) {
      fetchHistoricalData();
    }
  }, [location, dateRange]);
  var fetchHistoricalData = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* () {
      setLoading(true);
      try {
        var endDate = new Date().toISOString().split('T')[0];
        var startDate = new Date();
        if (dateRange === '1year') startDate.setFullYear(startDate.getFullYear() - 1);else if (dateRange === '5years') startDate.setFullYear(startDate.getFullYear() - 5);else if (dateRange === '10years') startDate.setFullYear(startDate.getFullYear() - 10);
        var response = yield climateAPI.getHistorical(location.lat, location.lon, startDate.toISOString().split('T')[0], endDate, location.city);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch historical data:', err);
      } finally {
        setLoading(false);
      }
    });
    return function fetchHistoricalData() {
      return _ref2.apply(this, arguments);
    };
  }();
  if (loading) return /*#__PURE__*/_jsx(Loader, {
    message: "Loading historical climate data..."
  });
  if (!data) return null;
  var chartData = data.data.timeSeries.dates.map((date, idx) => ({
    date: date,
    temperature: data.data.timeSeries.temperatureMean[idx],
    precipitation: data.data.timeSeries.precipitation[idx]
  })).filter(item => item.temperature !== null);
  return /*#__PURE__*/_jsxs("div", {
    className: "historical-data",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "widget-header",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "widget-title",
        children: "\uD83D\uDCCA Historical Climate Data"
      }), /*#__PURE__*/_jsxs("div", {
        className: "date-range-selector",
        children: [/*#__PURE__*/_jsx("button", {
          className: dateRange === '1year' ? 'active' : '',
          onClick: () => setDateRange('1year'),
          children: "1 Year"
        }), /*#__PURE__*/_jsx("button", {
          className: dateRange === '5years' ? 'active' : '',
          onClick: () => setDateRange('5years'),
          children: "5 Years"
        }), /*#__PURE__*/_jsx("button", {
          className: dateRange === '10years' ? 'active' : '',
          onClick: () => setDateRange('10years'),
          children: "10 Years"
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "climate-charts",
      children: [/*#__PURE__*/_jsx(LineChart, {
        data: chartData,
        xKey: "date",
        yKeys: ["temperature"],
        colors: ["#e74c3c"],
        title: "Temperature Trend (\xB0C)",
        height: 300
      }), /*#__PURE__*/_jsx(LineChart, {
        data: chartData,
        xKey: "date",
        yKeys: ["precipitation"],
        colors: ["#3498db"],
        title: "Precipitation Trend (mm)",
        height: 300
      })]
    }), data.data.anomalies && data.data.anomalies.length > 0 && /*#__PURE__*/_jsxs("div", {
      className: "climate-anomalies",
      children: [/*#__PURE__*/_jsx("h3", {
        children: "\u26A0\uFE0F Detected Anomalies"
      }), /*#__PURE__*/_jsx("div", {
        className: "anomalies-list",
        children: data.data.anomalies.slice(0, 5).map((anomaly, idx) => /*#__PURE__*/_jsxs("div", {
          className: "anomaly-item",
          children: [/*#__PURE__*/_jsx("span", {
            className: "anomaly-date",
            children: anomaly.date
          }), /*#__PURE__*/_jsx("span", {
            className: "anomaly-type",
            children: anomaly.type.replace('_', ' ')
          }), /*#__PURE__*/_jsx("span", {
            className: "anomaly-severity",
            children: anomaly.severity
          })]
        }, idx))
      })]
    })]
  });
};
export default HistoricalData;