import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url} - Success`);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.config?.url}`, error.message);
    return Promise.reject(error);
  }
);

export const weatherAPI = {
  getCurrent: (lat, lon, city) => 
    api.get('/weather/current', { params: { lat, lon, city } })
};

export const aqiAPI = {
  getCurrent: (lat, lon, city) => 
    api.get('/aqi/current', { params: { lat, lon, city } })
};

export const climateAPI = {
  getHistorical: (lat, lon, startDate, endDate, city) => 
    api.get('/climate/historical', { params: { lat, lon, startDate, endDate, city } }),
  
  getProjections: (lat, lon, scenario) => 
    api.get('/climate/projections', { params: { lat, lon, scenario } })
};

export const agricultureAPI = {
  getRecommendations: (lat, lon, city, soilType) => 
    api.get('/agriculture/recommendations', { params: { lat, lon, city, soilType } })
};

export const userAPI = {
  createProfile: (email, name) => 
    api.post('/users/profile', { email, name }),
  
  getFavorites: (userId) => 
    api.get(`/users/favorites/${userId}`),
  
  addFavorite: (userId, city, country, lat, lon, nickname) => 
    api.post('/users/favorites', { userId, city, country, lat, lon, nickname }),
  
  deleteFavorite: (id) => 
    api.delete(`/users/favorites/${id}`)
};

export default api;