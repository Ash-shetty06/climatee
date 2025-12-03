import { useState, useEffect } from 'react';
import { weatherAPI } from '../services/api';

const useWeather = (location) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await weatherAPI.getCurrent(
          location.lat,
          location.lon,
          location.city
        );

        if (response.data.success) {
          setWeatherData(response.data.data);
        } else {
          setError('Failed to fetch weather data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Network error');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  return { weatherData, loading, error };
};

export default useWeather;