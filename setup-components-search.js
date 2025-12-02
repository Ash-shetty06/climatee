const fs = require('fs');
const path = require('path');

console.log('🚀 Creating Search components...\n');

const files = {
  'frontend/src/components/Search/SearchBar.jsx': `import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({ onLocationSelect, currentLocation }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

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

  const searchLocation = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch(
        \`https://nominatim.openstreetmap.org/search?q=\${encodeURIComponent(searchQuery)}&format=json&limit=5\`
      );
      const data = await response.json();
      
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
  };

  const handleSelect = (location) => {
    onLocationSelect(location);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && <div className="search-loading">⏳</div>}
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSelect(suggestion)}
            >
              <span className="suggestion-icon">📍</span>
              <span className="suggestion-text">{suggestion.fullName}</span>
            </div>
          ))}
        </div>
      )}

      {currentLocation && (
        <div className="current-location-display">
          📍 {currentLocation.city}, {currentLocation.country}
        </div>
      )}
    </div>
  );
};

export default SearchBar;`,

  'frontend/src/components/Search/SearchBar.css': `.search-bar {
  flex: 1;
  position: relative;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 15px;
  font-size: 1.2rem;
}

.search-input {
  width: 100%;
  padding: 12px 45px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.search-loading {
  position: absolute;
  right: 15px;
  font-size: 1.2rem;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  margin-top: 5px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 12px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.suggestion-item:hover {
  background: #f5f5f5;
}

.suggestion-icon {
  font-size: 1.1rem;
}

.suggestion-text {
  font-size: 0.95rem;
  color: #333;
}

.current-location-display {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 5px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #666;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}`,

  'frontend/src/components/Search/Favorites.jsx': `import React, { useState, useEffect } from 'react';
import './Favorites.css';

const Favorites = ({ onLocationSelect }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(storedFavorites);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter(fav => fav.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  if (loading) return <div className="favorites-loading">Loading favorites...</div>;

  return (
    <div className="favorites-container">
      <h3>⭐ Your Favorite Locations</h3>
      {favorites.length === 0 ? (
        <p className="no-favorites">No favorite locations yet. Search and add some!</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((fav) => (
            <div key={fav.id} className="favorite-card">
              <div className="favorite-info" onClick={() => onLocationSelect(fav)}>
                <h4>{fav.city}</h4>
                <p>{fav.country || 'Unknown'}</p>
              </div>
              <button 
                className="remove-btn"
                onClick={() => removeFavorite(fav.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;`,

  'frontend/src/components/Search/Favorites.css': `.favorites-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.favorites-container h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 15px;
}

.favorites-loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.no-favorites {
  text-align: center;
  color: #999;
  padding: 20px;
  font-style: italic;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.favorite-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.favorite-card:hover {
  transform: translateY(-3px);
}

.favorite-info h4 {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.favorite-info p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.remove-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.remove-btn:hover {
  background: rgba(255,255,255,0.3);
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
console.log('\n✨ Search components created!\n');
