import axios from 'axios';
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
    const url = `${this.aqicnBaseURL}/feed/geo:${lat};${lon}/`;
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
    const url = `${this.openaqBaseURL}`;
    const params = {
      coordinates: `${lat},${lon}`,
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

export default new AQIService();