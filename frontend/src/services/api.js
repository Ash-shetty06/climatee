import axios from 'axios';
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
var api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});
api.interceptors.request.use(config => {
  console.log("API Request: ".concat(config.method.toUpperCase(), " ").concat(config.url));
  return config;
}, error => {
  return Promise.reject(error);
});
api.interceptors.response.use(response => {
  console.log("API Response: ".concat(response.config.url, " - Success"));
  return response;
}, error => {
  var _error$config;
  console.error("API Error: ".concat((_error$config = error.config) === null || _error$config === void 0 ? void 0 : _error$config.url), error.message);
  return Promise.reject(error);
});
export var weatherAPI = {
  getCurrent: (lat, lon, city) => api.get('/weather/current', {
    params: {
      lat,
      lon,
      city
    }
  })
};
export var aqiAPI = {
  getCurrent: (lat, lon, city) => api.get('/aqi/current', {
    params: {
      lat,
      lon,
      city
    }
  })
};
export var climateAPI = {
  getHistorical: (lat, lon, startDate, endDate, city) => api.get('/climate/historical', {
    params: {
      lat,
      lon,
      startDate,
      endDate,
      city
    }
  }),
  getProjections: (lat, lon, scenario) => api.get('/climate/projections', {
    params: {
      lat,
      lon,
      scenario
    }
  })
};
export var agricultureAPI = {
  getRecommendations: (lat, lon, city, soilType) => api.get('/agriculture/recommendations', {
    params: {
      lat,
      lon,
      city,
      soilType
    }
  })
};
export var userAPI = {
  createProfile: (email, name) => api.post('/users/profile', {
    email,
    name
  }),
  getFavorites: userId => api.get("/users/favorites/".concat(userId)),
  addFavorite: (userId, city, country, lat, lon, nickname) => api.post('/users/favorites', {
    userId,
    city,
    country,
    lat,
    lon,
    nickname
  }),
  deleteFavorite: id => api.delete("/users/favorites/".concat(id))
};
export default api;