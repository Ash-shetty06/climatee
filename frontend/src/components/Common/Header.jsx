import React from 'react';
import './Header.css';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var Header = () => {
  return /*#__PURE__*/_jsx("header", {
    className: "header",
    children: /*#__PURE__*/_jsxs("div", {
      className: "header-content",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "logo",
        children: [/*#__PURE__*/_jsx("span", {
          className: "logo-icon",
          children: "\uD83C\uDF0D"
        }), /*#__PURE__*/_jsx("h1", {
          children: "Weather Intelligence"
        })]
      }), /*#__PURE__*/_jsxs("nav", {
        className: "nav",
        children: [/*#__PURE__*/_jsx("a", {
          href: "#weather",
          children: "Weather"
        }), /*#__PURE__*/_jsx("a", {
          href: "#aqi",
          children: "Air Quality"
        }), /*#__PURE__*/_jsx("a", {
          href: "#climate",
          children: "Climate"
        }), /*#__PURE__*/_jsx("a", {
          href: "#agriculture",
          children: "Agriculture"
        })]
      })]
    })
  });
};
export default Header;