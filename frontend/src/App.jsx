function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import React, { useState, useEffect } from 'react';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import SearchBar from './components/Search/SearchBar';
import Favorites from './components/Search/Favorites';
import useLocation from './hooks/useLocation';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function App() {
  var [selectedLocation, setSelectedLocation] = useState(null);
  var [showFavorites, setShowFavorites] = useState(false);
  var {
    getCurrentLocation,
    loading: locationLoading
  } = useLocation();
  useEffect(() => {
    var autoDetect = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* () {
        var location = yield getCurrentLocation();
        if (location) {
          setSelectedLocation(location);
        }
      });
      return function autoDetect() {
        return _ref.apply(this, arguments);
      };
    }();
    autoDetect();
  }, []);
  var handleLocationSelect = location => {
    setSelectedLocation(location);
    setShowFavorites(false);
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "app-container",
    children: [/*#__PURE__*/_jsx(Header, {}), /*#__PURE__*/_jsxs("main", {
      className: "main-content",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "search-section",
        children: [/*#__PURE__*/_jsx(SearchBar, {
          onLocationSelect: handleLocationSelect,
          currentLocation: selectedLocation
        }), /*#__PURE__*/_jsx("button", {
          className: "favorites-toggle",
          onClick: () => setShowFavorites(!showFavorites),
          children: "\u2B50 Favorites"
        })]
      }), showFavorites && /*#__PURE__*/_jsx(Favorites, {
        onLocationSelect: handleLocationSelect
      }), selectedLocation ? /*#__PURE__*/_jsx(Dashboard, {
        location: selectedLocation
      }) : /*#__PURE__*/_jsx("div", {
        className: "welcome-screen",
        children: /*#__PURE__*/_jsxs("div", {
          className: "welcome-content",
          children: [/*#__PURE__*/_jsx("h1", {
            children: "\uD83C\uDF0D Weather, Climate & Air Quality Intelligence"
          }), /*#__PURE__*/_jsx("p", {
            children: "Your comprehensive environmental data platform"
          }), locationLoading ? /*#__PURE__*/_jsxs("div", {
            className: "loading",
            children: [/*#__PURE__*/_jsx("div", {
              className: "spinner"
            }), /*#__PURE__*/_jsx("p", {
              children: "Detecting your location..."
            })]
          }) : /*#__PURE__*/_jsxs("div", {
            className: "features",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "feature-card",
              children: [/*#__PURE__*/_jsx("span", {
                className: "icon",
                children: "\uD83C\uDF24\uFE0F"
              }), /*#__PURE__*/_jsx("h3", {
                children: "Real-time Weather"
              }), /*#__PURE__*/_jsx("p", {
                children: "Current conditions + 7-day forecast"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "feature-card",
              children: [/*#__PURE__*/_jsx("span", {
                className: "icon",
                children: "\uD83D\uDCA8"
              }), /*#__PURE__*/_jsx("h3", {
                children: "Air Quality"
              }), /*#__PURE__*/_jsx("p", {
                children: "AQI + pollutants monitoring"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "feature-card",
              children: [/*#__PURE__*/_jsx("span", {
                className: "icon",
                children: "\uD83D\uDCCA"
              }), /*#__PURE__*/_jsx("h3", {
                children: "Climate Analytics"
              }), /*#__PURE__*/_jsx("p", {
                children: "Historical data + projections"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "feature-card",
              children: [/*#__PURE__*/_jsx("span", {
                className: "icon",
                children: "\uD83C\uDF3E"
              }), /*#__PURE__*/_jsx("h3", {
                children: "Agriculture Insights"
              }), /*#__PURE__*/_jsx("p", {
                children: "Crop recommendations + alerts"
              })]
            })]
          })]
        })
      })]
    }), /*#__PURE__*/_jsx(Footer, {})]
  });
}
export default App;