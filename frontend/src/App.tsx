import React, { useState, useEffect } from 'react';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import SearchBar from './components/Search/SearchBar';
import Favorites from './components/Search/Favorites';
import useLocation from './hooks/useLocation';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const { getCurrentLocation, loading: locationLoading } = useLocation();

  useEffect(() => {
    const autoDetect = async () => {
      const location = await getCurrentLocation();
      if (location) {
        setSelectedLocation(location);
      }
    };
    autoDetect();
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowFavorites(false);
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <div className="search-section">
          <SearchBar 
            onLocationSelect={handleLocationSelect}
            currentLocation={selectedLocation}
          />
          <button 
            className="favorites-toggle"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            ⭐ Favorites
          </button>
        </div>

        {showFavorites && (
          <Favorites onLocationSelect={handleLocationSelect} />
        )}

        {selectedLocation ? (
          <Dashboard location={selectedLocation} />
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h1>🌍 Weather, Climate & Air Quality Intelligence</h1>
              <p>Your comprehensive environmental data platform</p>
              {locationLoading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Detecting your location...</p>
                </div>
              ) : (
                <div className="features">
                  <div className="feature-card">
                    <span className="icon">🌤️</span>
                    <h3>Real-time Weather</h3>
                    <p>Current conditions + 7-day forecast</p>
                  </div>
                  <div className="feature-card">
                    <span className="icon">💨</span>
                    <h3>Air Quality</h3>
                    <p>AQI + pollutants monitoring</p>
                  </div>
                  <div className="feature-card">
                    <span className="icon">📊</span>
                    <h3>Climate Analytics</h3>
                    <p>Historical data + projections</p>
                  </div>
                  <div className="feature-card">
                    <span className="icon">🌾</span>
                    <h3>Agriculture Insights</h3>
                    <p>Crop recommendations + alerts</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;