import { useState, useEffect } from 'react';
import { aqiAPI } from '../services/api';

const useAQI = (location) => {
  const [aqiData, setAQIData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchAQI = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await aqiAPI.getCurrent(
          location.lat,
          location.lon,
          location.city
        );

        if (response.data.success) {
          setAQIData(response.data.data);
        } else {
          setError('Failed to fetch AQI data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Network error');
        console.error('AQI fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAQI();
  }, [location]);

  return { aqiData, loading, error };
};

export default useAQI;