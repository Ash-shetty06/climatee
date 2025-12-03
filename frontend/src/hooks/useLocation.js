import { useState } from 'react';

const useLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        resolve(null);
        return;
      }

      setLoading(true);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            
            setLoading(false);
            resolve({
              lat: latitude,
              lon: longitude,
              city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
              country: data.address?.country || ''
            });
          } catch (err) {
            setLoading(false);
            resolve({
              lat: latitude,
              lon: longitude,
              city: 'Current Location',
              country: ''
            });
          }
        },
        (err) => {
          setLoading(false);
          setError('Unable to retrieve your location');
          console.error('Geolocation error:', err);
          resolve(null);
        }
      );
    });
  };

  return { getCurrentLocation, loading, error };
};

export default useLocation;