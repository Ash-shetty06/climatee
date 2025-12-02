const fs = require('fs');
const path = require('path');

console.log('🚀 Creating Common components...\n');

const files = {
  'frontend/src/components/Common/Header.jsx': `import React from 'react';
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

export default Header;`,

  'frontend/src/components/Common/Header.css': `.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 2rem;
}

.logo h1 {
  font-size: 1.5rem;
  color: #333;
  font-weight: 700;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav a {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav a:hover {
  color: #667eea;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
  }

  .nav {
    gap: 20px;
  }

  .nav a {
    font-size: 0.9rem;
  }
}`,

  'frontend/src/components/Common/Footer.jsx': `import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Weather Intelligence Platform. All rights reserved.</p>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;`,

  'frontend/src/components/Common/Footer.css': `.footer {
  background: white;
  margin-top: 40px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer p {
  color: #666;
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #667eea;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}`,

  'frontend/src/components/Common/Loader.jsx': `import React from 'react';
import './Loader.css';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;`,

  'frontend/src/components/Common/Loader.css': `.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loader-spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loader-message {
  margin-top: 20px;
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
}`
};

function createFiles(files) {
  Object.keys(files).forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, files[filePath]);
    console.log(`✅ Created: ${filePath}`);
  });
}

createFiles(files);
console.log('\n✨ Common components created!\n');
