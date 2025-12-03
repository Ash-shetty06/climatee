import React, { useState, useEffect } from 'react';
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

export default Favorites;