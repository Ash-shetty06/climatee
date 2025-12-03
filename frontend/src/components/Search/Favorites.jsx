function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import React, { useState, useEffect } from 'react';
import './Favorites.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var Favorites = _ref => {
  var {
    onLocationSelect
  } = _ref;
  var [favorites, setFavorites] = useState([]);
  var [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchFavorites();
  }, []);
  var fetchFavorites = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* () {
      try {
        var storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    });
    return function fetchFavorites() {
      return _ref2.apply(this, arguments);
    };
  }();
  var removeFavorite = id => {
    var updated = favorites.filter(fav => fav.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };
  if (loading) return /*#__PURE__*/_jsx("div", {
    className: "favorites-loading",
    children: "Loading favorites..."
  });
  return /*#__PURE__*/_jsxs("div", {
    className: "favorites-container",
    children: [/*#__PURE__*/_jsx("h3", {
      children: "\u2B50 Your Favorite Locations"
    }), favorites.length === 0 ? /*#__PURE__*/_jsx("p", {
      className: "no-favorites",
      children: "No favorite locations yet. Search and add some!"
    }) : /*#__PURE__*/_jsx("div", {
      className: "favorites-grid",
      children: favorites.map(fav => /*#__PURE__*/_jsxs("div", {
        className: "favorite-card",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "favorite-info",
          onClick: () => onLocationSelect(fav),
          children: [/*#__PURE__*/_jsx("h4", {
            children: fav.city
          }), /*#__PURE__*/_jsx("p", {
            children: fav.country || 'Unknown'
          })]
        }), /*#__PURE__*/_jsx("button", {
          className: "remove-btn",
          onClick: () => removeFavorite(fav.id),
          children: "\u2715"
        })]
      }, fav.id))
    })]
  });
};
export default Favorites;