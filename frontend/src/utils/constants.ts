export const API_ENDPOINTS = {
  WEATHER: '/weather/current',
  AQI: '/aqi/current',
  CLIMATE_HISTORICAL: '/climate/historical',
  CLIMATE_PROJECTIONS: '/climate/projections',
  AGRICULTURE: '/agriculture/recommendations'
};

export const AQI_CATEGORIES = {
  GOOD: { min: 0, max: 50, color: '#4caf50', label: 'Good' },
  MODERATE: { min: 51, max: 100, color: '#ffeb3b', label: 'Moderate' },
  UNHEALTHY: { min: 151, max: 200, color: '#f44336', label: 'Unhealthy' }
};