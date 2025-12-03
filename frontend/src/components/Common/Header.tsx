import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🌍</span>
          <h1>Weather Intelligence</h1>
        </div>
        <nav className="nav">
          <a href="#weather">Weather</a>
          <a href="#aqi">Air Quality</a>
          <a href="#climate">Climate</a>
          <a href="#agriculture">Agriculture</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;