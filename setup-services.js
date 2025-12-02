const fs = require('fs');
const path = require('path');

console.log('🚀 Creating backend services files...\n');

const servicesFiles = {
  'backend/services/cacheService.js': `import NodeCache from 'node-cache';
import CachedData from '../models/CachedData.js';

const memoryCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

class CacheService {
  constructor() {
    this.TTL = parseInt(process.env.CACHE_TTL) || 300;
  }

  generateKey(type, params) {
    const sortedParams = Object.keys(params).sort().map(key => \`\${key}:\${params[key]}\`).join('|');
    return \`\${type}:\${sortedParams}\`;
  }

  async get(key) {
    const memoryData = memoryCache.get(key);
    if (memoryData) {
      console.log(\`Cache HIT (Memory): \${key}\`);
      return memoryData;
    }

    try {
      const cachedData = await CachedData.findOne({
        cacheKey: key,
        expiresAt: { $gt: new Date() }
      });

      if (cachedData) {
        console.log(\`Cache HIT (MongoDB): \${key}\`);
        memoryCache.set(key, cachedData.data, this.TTL);
        return cachedData.data;
      }
    } catch (error) {
      console.error('MongoDB cache read error:', error.message);
    }

    console.log(\`Cache MISS: \${key}\`);
    return null;
  }

  async set(key, data, type, location = {}) {
    memoryCache.set(key, data, this.TTL);

    try {
      const expiresAt = new Date(Date.now() + this.TTL * 1000);
      await CachedData.findOneAndUpdate(
        { cacheKey: key },
        {
          cacheKey: key,
          dataType: type,
          location,
          data,
          expiresAt,
          createdAt: new Date()
        },
        { upsert: true, new: true }
      );
      console.log(\`Cache SET: \${key}\`);
    } catch (error) {
      console.error('MongoDB cache write error:', error.message);
    }
  }

  async clear(key) {
    memoryCache.del(key);
    try {
      await CachedData.deleteOne({ cacheKey: key });
      console.log(\`Cache CLEARED: \${key}\`);
    } catch (error) {
      console.error('MongoDB cache clear error:', error.message);
    }
  }

  async clearAll() {
    memoryCache.flushAll();
    try {
      await CachedData.deleteMany({});
      console.log('All cache CLEARED');
    } catch (error) {
      console.error('MongoDB cache clear all error:', error.message);
    }
  }

  getStats() {
    return {
      keys: memoryCache.keys(),
      stats: memoryCache.getStats()
    };
  }
}

export default new CacheService();`,

  'backend/services/weatherService.js': `import axios from 'axios';
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
    const url = \`\${process.env.WEATHERAPI_BASE_URL}/forecast.json\`;
    const params = {
      key: this.weatherApiKey,
      q: \`\${lat},\${lon}\`,
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

export default new WeatherService();`,

  'backend/services/aqiService.js': `import axios from 'axios';
import cacheService from './cacheService.js';
import fallbackHandler from '../utils/fallbackHandler.js';

class AQIService {
  constructor() {
    this.aqicnKey = process.env.AQICN_KEY;
    this.aqicnBaseURL = process.env.AQICN_BASE_URL;
    this.openaqBaseURL = process.env.OPENAQ_BASE_URL;
  }

  async getAQIData(lat, lon, city) {
    const cacheKey = cacheService.generateKey('aqi', { lat, lon });
    
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const apiCalls = [
      {
        name: 'AQICN',
        call: () => this.fetchAQICN(lat, lon)
      },
      {
        name: 'OpenAQ',
        call: () => this.fetchOpenAQ(lat, lon)
      }
    ];

    const result = await fallbackHandler.executeWithFallback(apiCalls, 'aqi');
    
    await cacheService.set(cacheKey, result, 'aqi', { lat, lon, city });
    
    return result;
  }

  async fetchAQICN(lat, lon) {
    const url = \`\${this.aqicnBaseURL}/feed/geo:\${lat};\${lon}/\`;
    const params = { token: this.aqicnKey };

    const response = await axios.get(url, { params, timeout: 10000 });
    
    if (response.data.status !== 'ok') {
      throw new Error('AQICN API returned error status');
    }

    return {
      data: this.formatAQICNData(response.data.data)
    };
  }

  formatAQICNData(data) {
    const iaqi = data.iaqi || {};
    
    return {
      aqi: data.aqi,
      dominantPollutant: data.dominantpol,
      pollutants: {
        pm25: iaqi.pm25?.v || null,
        pm10: iaqi.pm10?.v || null,
        no2: iaqi.no2?.v || null,
        so2: iaqi.so2?.v || null,
        co: iaqi.co?.v || null,
        o3: iaqi.o3?.v || null
      },
      category: this.getAQICategory(data.aqi),
      healthAdvisory: this.getHealthAdvisory(data.aqi),
      station: {
        name: data.city?.name,
        location: data.city?.geo
      },
      timestamp: data.time?.iso
    };
  }

  async fetchOpenAQ(lat, lon) {
    const url = \`\${this.openaqBaseURL}\`;
    const params = {
      coordinates: \`\${lat},\${lon}\`,
      radius: 25000,
      limit: 100
    };

    const response = await axios.get(url, { params, timeout: 10000 });
    
    return {
      data: this.formatOpenAQData(response.data.results)
    };
  }

  formatOpenAQData(results) {
    if (!results || results.length === 0) {
      throw new Error('No AQI data available from OpenAQ');
    }

    const pollutants = {};
    results.forEach(result => {
      result.measurements.forEach(measurement => {
        const param = measurement.parameter;
        if (!pollutants[param] || measurement.lastUpdated > pollutants[param].lastUpdated) {
          pollutants[param] = {
            value: measurement.value,
            unit: measurement.unit,
            lastUpdated: measurement.lastUpdated
          };
        }
      });
    });

    const aqi = this.calculateAQI(pollutants);

    return {
      aqi,
      dominantPollutant: this.getDominantPollutant(pollutants),
      pollutants: {
        pm25: pollutants.pm25?.value || null,
        pm10: pollutants.pm10?.value || null,
        no2: pollutants.no2?.value || null,
        so2: pollutants.so2?.value || null,
        co: pollutants.co?.value || null,
        o3: pollutants.o3?.value || null
      },
      category: this.getAQICategory(aqi),
      healthAdvisory: this.getHealthAdvisory(aqi),
      station: {
        name: results[0].location,
        location: results[0].coordinates
      },
      timestamp: new Date().toISOString()
    };
  }

  calculateAQI(pollutants) {
    let maxAqi = 50;
    if (pollutants.pm25) maxAqi = Math.max(maxAqi, this.pm25ToAQI(pollutants.pm25.value));
    if (pollutants.pm10) maxAqi = Math.max(maxAqi, this.pm10ToAQI(pollutants.pm10.value));
    return Math.round(maxAqi);
  }

  pm25ToAQI(c) {
    if (c <= 12.0) return (c / 12.0) * 50;
    if (c <= 35.4) return ((c - 12.1) / 23.3) * 50 + 50;
    if (c <= 55.4) return ((c - 35.5) / 19.9) * 50 + 100;
    if (c <= 150.4) return ((c - 55.5) / 94.9) * 50 + 150;
    return 300;
  }

  pm10ToAQI(c) {
    if (c <= 54) return (c / 54) * 50;
    if (c <= 154) return ((c - 55) / 99) * 50 + 50;
    if (c <= 254) return ((c - 155) / 99) * 50 + 100;
    return 200;
  }

  getDominantPollutant(pollutants) {
    let maxPollutant = 'pm25';
    let maxValue = 0;
    Object.keys(pollutants).forEach(key => {
      if (pollutants[key]?.value > maxValue) {
        maxValue = pollutants[key].value;
        maxPollutant = key;
      }
    });
    return maxPollutant.toUpperCase();
  }

  getAQICategory(aqi) {
    if (aqi <= 50) return { level: 'Good', color: 'green' };
    if (aqi <= 100) return { level: 'Moderate', color: 'yellow' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'orange' };
    if (aqi <= 200) return { level: 'Unhealthy', color: 'red' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: 'purple' };
    return { level: 'Hazardous', color: 'maroon' };
  }

  getHealthAdvisory(aqi) {
    if (aqi <= 50) {
      return {
        general: 'Air quality is satisfactory, and air pollution poses little or no risk.',
        sensitive: 'Enjoy outdoor activities.',
        recommendation: 'None'
      };
    }
    if (aqi <= 100) {
      return {
        general: 'Air quality is acceptable. However, there may be a risk for some people.',
        sensitive: 'Unusually sensitive people should consider limiting prolonged outdoor exertion.',
        recommendation: 'Limit prolonged outdoor activity if sensitive'
      };
    }
    if (aqi <= 150) {
      return {
        general: 'Members of sensitive groups may experience health effects.',
        sensitive: 'People with respiratory or heart disease, children, and older adults should limit prolonged outdoor exertion.',
        recommendation: 'Reduce outdoor activities for sensitive groups'
      };
    }
    if (aqi <= 200) {
      return {
        general: 'Some members of the general public may experience health effects.',
        sensitive: 'People with respiratory or heart disease, children, and older adults should avoid prolonged outdoor exertion.',
        recommendation: 'Avoid prolonged outdoor activity'
      };
    }
    return {
      general: 'Health alert: The risk of health effects is increased for everyone.',
      sensitive: 'People with respiratory or heart disease, children, and older adults should avoid all outdoor physical activity.',
      recommendation: 'Stay indoors, use air purifiers'
    };
  }
}

export default new AQIService();`
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

createFiles(servicesFiles);

console.log('\n✨ Services files created successfully!');
console.log('\n📝 Still need to create:');
console.log('  - climateService.js');
console.log('  - agricultureService.js');
console.log('  - All frontend files');
