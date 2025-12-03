import React from 'react';
import './Loader.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var Loader = _ref => {
  var {
    message = 'Loading...'
  } = _ref;
  return /*#__PURE__*/_jsxs("div", {
    className: "loader-container",
    children: [/*#__PURE__*/_jsx("div", {
      className: "loader-spinner"
    }), /*#__PURE__*/_jsx("p", {
      className: "loader-message",
      children: message
    })]
  });
};
export default Loader;