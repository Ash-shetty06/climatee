function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var SearchBar = _ref => {
  var {
    onLocationSelect,
    currentLocation
  } = _ref;
  var [query, setQuery] = useState('');
  var [suggestions, setSuggestions] = useState([]);
  var [loading, setLoading] = useState(false);
  var debounceTimer = useRef(null);
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      searchLocation(query);
    }, 500);
    return () => clearTimeout(debounceTimer.current);
  }, [query]);
  var searchLocation = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (searchQuery) {
      setLoading(true);
      try {
        var response = yield fetch("https://nominatim.openstreetmap.org/search?q=".concat(encodeURIComponent(searchQuery), "&format=json&limit=5"));
        var data = yield response.json();
        setSuggestions(data.map(item => ({
          city: item.display_name.split(',')[0],
          fullName: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        })));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    });
    return function searchLocation(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  var handleSelect = location => {
    onLocationSelect(location);
    setQuery('');
    setSuggestions([]);
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "search-bar",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "search-input-wrapper",
      children: [/*#__PURE__*/_jsx("span", {
        className: "search-icon",
        children: "\uD83D\uDD0D"
      }), /*#__PURE__*/_jsx("input", {
        type: "text",
        className: "search-input",
        placeholder: "Search for a city...",
        value: query,
        onChange: e => setQuery(e.target.value)
      }), loading && /*#__PURE__*/_jsx("div", {
        className: "search-loading",
        children: "\u23F3"
      })]
    }), suggestions.length > 0 && /*#__PURE__*/_jsx("div", {
      className: "suggestions-dropdown",
      children: suggestions.map((suggestion, index) => /*#__PURE__*/_jsxs("div", {
        className: "suggestion-item",
        onClick: () => handleSelect(suggestion),
        children: [/*#__PURE__*/_jsx("span", {
          className: "suggestion-icon",
          children: "\uD83D\uDCCD"
        }), /*#__PURE__*/_jsx("span", {
          className: "suggestion-text",
          children: suggestion.fullName
        })]
      }, index))
    }), currentLocation && /*#__PURE__*/_jsxs("div", {
      className: "current-location-display",
      children: ["\uD83D\uDCCD ", currentLocation.city, ", ", currentLocation.country]
    })]
  });
};
export default SearchBar;