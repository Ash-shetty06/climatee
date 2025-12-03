import axios from 'axios';
import cacheService from './cacheService.js';
import fallbackHandler from '../utils/fallbackHandler.js';

class WeatherService {
  constructor() {
    this.openMeteoBaseURL = process.env.OPEN_METEO_BASE_URL;
    this.weatherApiKey = process.env.WEATHERAPI_KEY;
    this.visualCrossingKey = process.env.VISUAL_CROSSING_KEY;
  }

  async getCurrentWeather(lat, lon, city) {
    const cacheKey = cacheService.generateKey('weather', { lat, lon });
    
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const apiCalls = [
      {
        name: 'Open-Meteo',
        call: () => this.fetchOpenMeteoWeather(lat, lon)
      },
      {
        name: 'WeatherAPI',
        call: () => this.fetchWeatherAPI(lat, lon)
      }
    ];

    const result = await fallbackHandler.executeWithFallback(apiCalls, 'weather');
    
    await cacheService.set(cacheKey, result, 'weather', { lat, lon, city });
    
    return result;
  }

  async fetchOpenMeteoWeather(lat, lon) {
    const params = {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
      hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max',
      timezone: 'auto',
      forecast_days: 7
    };

    const response = await axios.get(this.openMeteoBaseURL, { params, timeout: 10000 });
    
    return {
      data: this.formatOpenMeteoData(response.data)
    };
  }

  formatOpenMeteoData(data) {
    const current = data.current;
    const hourly = data.hourly;
    const daily = data.daily;

    return {
      current: {
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        cloudCover: current.cloud_cover,
        precipitation: current.precipitation,
        weatherCode: current.weather_code,
        condition: this.getWeatherCondition(current.weather_code),
        timestamp: current.time
      },
      hourly: {
        time: hourly.time.slice(0, 48),
        temperature: hourly.temperature_2m.slice(0, 48),
        humidity: hourly.relative_humidity_2m.slice(0, 48),
        precipitation: hourly.precipitation.slice(0, 48),
        precipitationProbability: hourly.precipitation_probability.slice(0, 48),
        windSpeed: hourly.wind_speed_10m.slice(0, 48)
      },
      daily: {
        time: daily.time,
        weatherCode: daily.weather_code,
        temperatureMax: daily.temperature_2m_max,
        temperatureMin: daily.temperature_2m_min,
        sunrise: daily.sunrise,
        sunset: daily.sunset,
        precipitation: daily.precipitation_sum,
        precipitationProbability: daily.precipitation_probability_max,
        windSpeedMax: daily.wind_speed_10m_max,
        uvIndexMax: daily.uv_index_max
      },
      alerts: this.detectSevereWeather(current, daily)
    };
  }

  async fetchWeatherAPI(lat, lon) {
    const url = `${process.env.WEATHERAPI_BASE_URL}/forecast.json`;
    const params = {
      key: this.weatherApiKey,
      q: `${lat},${lon}`,
      days: 7,
      aqi: 'yes',
      alerts: 'yes'
    };

    const response = await axios.get(url, { params, timeout: 10000 });
    
    return {
      data: this.formatWeatherAPIData(response.data)
    };
  }

  formatWeatherAPIData(data) {
    const current = data.current;
    const forecast = data.forecast.forecastday;

    return {
      current: {
        temperature: current.temp_c,
        feelsLike: current.feelslike_c,
        humidity: current.humidity,
        pressure: current.pressure_mb,
        windSpeed: current.wind_kph,
        windDirection: current.wind_degree,
        cloudCover: current.cloud,
        precipitation: current.precip_mm,
        condition: current.condition.text,
        uvIndex: current.uv,
        visibility: current.vis_km,
        timestamp: data.location.localtime
      },
      hourly: {
        time: forecast[0].hour.map(h => h.time),
        temperature: forecast[0].hour.map(h => h.temp_c),
        humidity: forecast[0].hour.map(h => h.humidity),
        precipitation: forecast[0].hour.map(h => h.precip_mm),
        precipitationProbability: forecast[0].hour.map(h => h.chance_of_rain),
        windSpeed: forecast[0].hour.map(h => h.wind_kph)
      },
      daily: {
        time: forecast.map(d => d.date),
        temperatureMax: forecast.map(d => d.day.maxtemp_c),
        temperatureMin: forecast.map(d => d.day.mintemp_c),
        condition: forecast.map(d => d.day.condition.text),
        precipitation: forecast.map(d => d.day.totalprecip_mm),
        precipitationProbability: forecast.map(d => d.day.daily_chance_of_rain),
        windSpeedMax: forecast.map(d => d.day.maxwind_kph),
        uvIndexMax: forecast.map(d => d.day.uv),
        sunrise: forecast.map(d => d.astro.sunrise),
        sunset: forecast.map(d => d.astro.sunset)
      },
      alerts: data.alerts?.alert || []
    };
  }

  getWeatherCondition(code) {
    const conditions = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 51: 'Light drizzle', 61: 'Slight rain', 63: 'Moderate rain',
      65: 'Heavy rain', 71: 'Slight snow', 95: 'Thunderstorm'
    };
    return conditions[code] || 'Unknown';
  }

  detectSevereWeather(current, daily) {
    const alerts = [];

    if (current.temperature_2m > 40) {
      alerts.push({
        type: 'HEATWAVE',
        severity: 'HIGH',
        message: 'Extreme heat conditions. Stay hydrated and avoid outdoor activities.',
        color: 'red'
      });
    }

    if (current.precipitation > 50) {
      alerts.push({
        type: 'HEAVY_RAIN',
        severity: 'HIGH',
        message: 'Heavy rainfall detected. Risk of flooding.',
        color: 'orange'
      });
    }

    if (current.wind_speed_10m > 60) {
      alerts.push({
        type: 'STRONG_WIND',
        severity: 'MEDIUM',
        message: 'Strong winds detected. Secure loose objects.',
        color: 'yellow'
      });
    }

    return alerts;
  }
}

export default new WeatherService();