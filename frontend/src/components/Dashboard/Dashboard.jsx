import React, { useState } from 'react';
import CurrentWeather from '../Weather/CurrentWeather';
import HourlyForecast from '../Weather/HourlyForecast';
import WeeklyForecast from '../Weather/WeeklyForecast';
import WeatherAlerts from '../Weather/WeatherAlerts';
import AQIDisplay from '../AQI/AQIDisplay';
import PollutantBreakdown from '../AQI/PollutantBreakdown';
import HealthAdvisory from '../AQI/HealthAdvisory';
import HistoricalData from '../Climate/HistoricalData';
import ClimateProjections from '../Climate/ClimateProjections';
import CropRecommendations from '../Agriculture/CropRecommendations';
import WeatherMap from '../Maps/WeatherMap';
import Loader from '../Common/Loader';
import useWeather from '../../hooks/useWeather';
import useAQI from '../../hooks/useAQI';
import './Dashboard.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var Dashboard = _ref => {
  var _weatherData$data, _weatherData$data2, _weatherData$data3, _aqiData$data, _aqiData$data2, _aqiData$data3;
  var {
    location
  } = _ref;
  var [activeTab, setActiveTab] = useState('overview');
  var {
    weatherData,
    loading: weatherLoading,
    error: weatherError
  } = useWeather(location);
  var {
    aqiData,
    loading: aqiLoading,
    error: aqiError
  } = useAQI(location);
  if (weatherLoading || aqiLoading) {
    return /*#__PURE__*/_jsx(Loader, {
      message: "Loading environmental data..."
    });
  }
  if (weatherError || aqiError) {
    return /*#__PURE__*/_jsxs("div", {
      className: "error-container",
      children: [/*#__PURE__*/_jsx("h2", {
        children: "\u26A0\uFE0F Error Loading Data"
      }), /*#__PURE__*/_jsx("p", {
        children: weatherError || aqiError
      })]
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "dashboard-container",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "dashboard-tabs",
      children: [/*#__PURE__*/_jsx("button", {
        className: activeTab === 'overview' ? 'tab active' : 'tab',
        onClick: () => setActiveTab('overview'),
        children: "\uD83D\uDCCA Overview"
      }), /*#__PURE__*/_jsx("button", {
        className: activeTab === 'climate' ? 'tab active' : 'tab',
        onClick: () => setActiveTab('climate'),
        children: "\uD83D\uDCC8 Climate Analytics"
      }), /*#__PURE__*/_jsx("button", {
        className: activeTab === 'agriculture' ? 'tab active' : 'tab',
        onClick: () => setActiveTab('agriculture'),
        children: "\uD83C\uDF3E Agriculture"
      }), /*#__PURE__*/_jsx("button", {
        className: activeTab === 'map' ? 'tab active' : 'tab',
        onClick: () => setActiveTab('map'),
        children: "\uD83D\uDDFA\uFE0F Map View"
      })]
    }), activeTab === 'overview' && /*#__PURE__*/_jsxs("div", {
      className: "dashboard",
      children: [/*#__PURE__*/_jsx("div", {
        className: "widget weather-current",
        style: {
          gridColumn: 'span 4'
        },
        children: /*#__PURE__*/_jsx(CurrentWeather, {
          data: weatherData,
          location: location
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "widget aqi-display",
        style: {
          gridColumn: 'span 4'
        },
        children: /*#__PURE__*/_jsx(AQIDisplay, {
          data: aqiData
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "widget weather-alerts",
        style: {
          gridColumn: 'span 4'
        },
        children: /*#__PURE__*/_jsx(WeatherAlerts, {
          alerts: (weatherData === null || weatherData === void 0 || (_weatherData$data = weatherData.data) === null || _weatherData$data === void 0 ? void 0 : _weatherData$data.alerts) || []
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "widget hourly-forecast",
        style: {
          gridColumn: 'span 12'
        },
        children: /*#__PURE__*/_jsx(HourlyForecast, {
          data: weatherData === null || weatherData === void 0 || (_weatherData$data2 = weatherData.data) === null || _weatherData$data2 === void 0 ? void 0 : _weatherData$data2.hourly
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "widget weekly-forecast",
        style: {
          gridColumn: 'span 8'
        },
        children: /*#__PURE__*/_jsx(WeeklyForecast, {
          data: weatherData === null || weatherData === void 0 || (_weatherData$data3 = weatherData.data) === null || _weatherData$data3 === void 0 ? void 0 : _weatherData$data3.daily
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "widget pollutant-breakdown",
        style: {
          gridColumn: 'span 4'
        },
        children: /*#__PURE__*/_jsx(PollutantBreakdown, {
          data: aqiData === null || aqiData === void 0 || (_aqiData$data = aqiData.data) === null || _aqiData$data === void 0 ? void 0 : _aqiData$data.pollutants
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "widget health-advisory",
        style: {
          gridColumn: 'span 12'
        },
        children: /*#__PURE__*/_jsx(HealthAdvisory, {
          data: aqiData === null || aqiData === void 0 || (_aqiData$data2 = aqiData.data) === null || _aqiData$data2 === void 0 ? void 0 : _aqiData$data2.healthAdvisory,
          aqi: aqiData === null || aqiData === void 0 || (_aqiData$data3 = aqiData.data) === null || _aqiData$data3 === void 0 ? void 0 : _aqiData$data3.aqi
        })
      })]
    }), activeTab === 'climate' && /*#__PURE__*/_jsxs("div", {
      className: "dashboard",
      children: [/*#__PURE__*/_jsx("div", {
        className: "widget",
        style: {
          gridColumn: 'span 12'
        },
        children: /*#__PURE__*/_jsx(HistoricalData, {
          location: location
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "widget",
        style: {
          gridColumn: 'span 12'
        },
        children: /*#__PURE__*/_jsx(ClimateProjections, {
          location: location
        })
      })]
    }), activeTab === 'agriculture' && /*#__PURE__*/_jsx("div", {
      className: "dashboard",
      children: /*#__PURE__*/_jsx("div", {
        className: "widget",
        style: {
          gridColumn: 'span 12'
        },
        children: /*#__PURE__*/_jsx(CropRecommendations, {
          location: location,
          weatherData: weatherData
        })
      })
    }), activeTab === 'map' && /*#__PURE__*/_jsx("div", {
      className: "dashboard",
      children: /*#__PURE__*/_jsx("div", {
        className: "widget",
        style: {
          gridColumn: 'span 12',
          minHeight: '600px'
        },
        children: /*#__PURE__*/_jsx(WeatherMap, {
          location: location,
          weatherData: weatherData,
          aqiData: aqiData
        })
      })
    })]
  });
};
export default Dashboard;