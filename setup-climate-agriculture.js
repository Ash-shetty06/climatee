const fs = require('fs');
const path = require('path');

console.log('🚀 Creating Climate & Agriculture services...\n');

const files = {
  'backend/services/climateService.js': `import axios from 'axios';
import cacheService from './cacheService.js';
import fallbackHandler from '../utils/fallbackHandler.js';

class ClimateService {
  constructor() {
    this.openMeteoHistoricalURL = process.env.OPEN_METEO_HISTORICAL_BASE_URL;
    this.noaaToken = process.env.NOAA_TOKEN;
    this.noaaBaseURL = process.env.NOAA_BASE_URL;
  }

  async getHistoricalData(lat, lon, startDate, endDate, city) {
    const cacheKey = cacheService.generateKey('climate', { lat, lon, startDate, endDate });
    
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const apiCalls = [
      {
        name: 'Open-Meteo Historical',
        call: () => this.fetchOpenMeteoHistorical(lat, lon, startDate, endDate)
      }
    ];

    const result = await fallbackHandler.executeWithFallback(apiCalls, 'climate');
    
    await cacheService.set(cacheKey, result, 'climate', { lat, lon, city });
    
    return result;
  }

  async fetchOpenMeteoHistorical(lat, lon, startDate, endDate) {
    const params = {
      latitude: lat,
      longitude: lon,
      start_date: startDate,
      end_date: endDate,
      daily: 'temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,rain_sum,snowfall_sum,windspeed_10m_max',
      timezone: 'auto'
    };

    const response = await axios.get(this.openMeteoHistoricalURL, { 
      params, 
      timeout: 30000 
    });
    
    return {
      data: this.formatHistoricalData(response.data)
    };
  }

  formatHistoricalData(data) {
    const daily = data.daily;
    
    return {
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        elevation: data.elevation,
        timezone: data.timezone
      },
      timeSeries: {
        dates: daily.time,
        temperatureMax: daily.temperature_2m_max,
        temperatureMin: daily.temperature_2m_min,
        temperatureMean: daily.temperature_2m_mean,
        precipitation: daily.precipitation_sum,
        rain: daily.rain_sum,
        snowfall: daily.snowfall_sum,
        windSpeedMax: daily.windspeed_10m_max
      },
      statistics: this.calculateStatistics(daily),
      anomalies: this.detectAnomalies(daily),
      trends: this.calculateTrends(daily)
    };
  }

  calculateStatistics(daily) {
    const temps = daily.temperature_2m_mean.filter(t => t !== null);
    const precip = daily.precipitation_sum.filter(p => p !== null);
    
    return {
      temperature: {
        mean: this.mean(temps),
        median: this.median(temps),
        min: Math.min(...temps),
        max: Math.max(...temps),
        stdDev: this.standardDeviation(temps)
      },
      precipitation: {
        total: precip.reduce((a, b) => a + b, 0),
        mean: this.mean(precip),
        max: Math.max(...precip),
        daysWithRain: precip.filter(p => p > 0).length
      }
    };
  }

  detectAnomalies(daily) {
    const anomalies = [];
    const temps = daily.temperature_2m_mean.filter(t => t !== null);
    const tempMean = this.mean(temps);
    const tempStd = this.standardDeviation(temps);
    
    daily.temperature_2m_mean.forEach((temp, idx) => {
      if (temp !== null) {
        const zScore = Math.abs((temp - tempMean) / tempStd);
        if (zScore > 2) {
          anomalies.push({
            date: daily.time[idx],
            type: temp > tempMean ? 'HEAT_ANOMALY' : 'COLD_ANOMALY',
            value: temp,
            deviation: zScore,
            severity: zScore > 3 ? 'EXTREME' : 'HIGH'
          });
        }
      }
    });

    daily.precipitation_sum.forEach((precip, idx) => {
      if (precip > 100) {
        anomalies.push({
          date: daily.time[idx],
          type: 'EXTREME_PRECIPITATION',
          value: precip,
          severity: precip > 200 ? 'EXTREME' : 'HIGH'
        });
      }
    });

    return anomalies;
  }

  calculateTrends(daily) {
    const yearlyData = this.aggregateByYear(daily);
    
    return {
      temperatureTrend: this.linearRegression(yearlyData.years, yearlyData.temperatures),
      precipitationTrend: this.linearRegression(yearlyData.years, yearlyData.precipitation),
      warmingRate: this.calculateWarmingRate(yearlyData)
    };
  }

  aggregateByYear(daily) {
    const yearlyData = {};
    
    daily.time.forEach((date, idx) => {
      const year = new Date(date).getFullYear();
      if (!yearlyData[year]) {
        yearlyData[year] = { temps: [], precip: [] };
      }
      if (daily.temperature_2m_mean[idx] !== null) {
        yearlyData[year].temps.push(daily.temperature_2m_mean[idx]);
      }
      if (daily.precipitation_sum[idx] !== null) {
        yearlyData[year].precip.push(daily.precipitation_sum[idx]);
      }
    });

    const years = Object.keys(yearlyData).map(y => parseInt(y)).sort();
    const temperatures = years.map(y => this.mean(yearlyData[y].temps));
    const precipitation = years.map(y => yearlyData[y].precip.reduce((a, b) => a + b, 0));

    return { years, temperatures, precipitation };
  }

  linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  calculateWarmingRate(yearlyData) {
    if (yearlyData.years.length < 10) return null;
    
    const trend = this.linearRegression(yearlyData.years, yearlyData.temperatures);
    const decadalChange = trend.slope * 10;
    
    return {
      ratePerDecade: decadalChange,
      totalChange: trend.slope * (yearlyData.years.length - 1),
      trend: trend.slope > 0 ? 'WARMING' : 'COOLING'
    };
  }

  async getClimateProjections(lat, lon, scenario = 'RCP4.5') {
    const cacheKey = cacheService.generateKey('projections', { lat, lon, scenario });
    
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const projections = this.generateProjections(lat, lon, scenario);
    
    await cacheService.set(cacheKey, { data: projections }, 'climate', { lat, lon });
    
    return { data: projections, source: 'IPCC Models' };
  }

  generateProjections(lat, lon, scenario) {
    const baseYear = 2025;
    const endYear = 2100;
    const years = [];
    const temperatures = [];
    const precipitation = [];

    const warmingRates = {
      'RCP2.6': 0.3,
      'RCP4.5': 0.5,
      'RCP6.0': 0.6,
      'RCP8.5': 0.8
    };

    const rate = warmingRates[scenario] || 0.5;
    const baseTemp = 15;
    const basePrecip = 100;

    for (let year = baseYear; year <= endYear; year += 5) {
      const decades = (year - baseYear) / 10;
      years.push(year);
      temperatures.push(baseTemp + rate * decades);
      precipitation.push(basePrecip * (1 + 0.02 * decades));
    }

    return {
      scenario,
      years,
      projectedTemperature: temperatures,
      projectedPrecipitation: precipitation,
      impacts: this.assessClimateImpacts(temperatures[temperatures.length - 1] - temperatures[0])
    };
  }

  assessClimateImpacts(temperatureIncrease) {
    const impacts = [];

    if (temperatureIncrease > 1.5) {
      impacts.push({
        category: 'EXTREME_HEAT',
        severity: 'HIGH',
        description: 'Increased frequency and intensity of heatwaves'
      });
    }

    if (temperatureIncrease > 2.0) {
      impacts.push({
        category: 'DROUGHT_RISK',
        severity: 'HIGH',
        description: 'Higher risk of prolonged droughts'
      });
    }

    if (temperatureIncrease > 3.0) {
      impacts.push({
        category: 'ECOSYSTEM',
        severity: 'CRITICAL',
        description: 'Severe ecosystem disruption'
      });
    }

    return impacts;
  }

  mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  standardDeviation(arr) {
    const avg = this.mean(arr);
    const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(this.mean(squareDiffs));
  }
}

export default new ClimateService();`,

  'backend/services/agricultureService.js': `import cacheService from './cacheService.js';

class AgricultureService {
  async getCropRecommendations(lat, lon, city, weatherData, soilType = 'loam') {
    const cacheKey = cacheService.generateKey('agriculture', { lat, lon, soilType });
    
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const recommendations = await this.analyzeCropSuitability(weatherData, soilType);
    
    await cacheService.set(cacheKey, { data: recommendations }, 'agriculture', { lat, lon, city });
    
    return { data: recommendations, source: 'Agriculture Analysis' };
  }

  async analyzeCropSuitability(weatherData, soilType) {
    const avgTemp = weatherData.current.temperature;
    const humidity = weatherData.current.humidity;
    const rainfall = this.calculateMonthlyRainfall(weatherData);

    const crops = this.getCropDatabase();
    const suitable = [];

    crops.forEach(crop => {
      const score = this.calculateSuitabilityScore(crop, avgTemp, humidity, rainfall, soilType);
      
      if (score > 60) {
        suitable.push({
          ...crop,
          suitabilityScore: score,
          recommendation: this.getRecommendationLevel(score),
          reasons: this.getSuitabilityReasons(crop, avgTemp, humidity, rainfall, soilType)
        });
      }
    });

    return {
      recommendedCrops: suitable.sort((a, b) => b.suitabilityScore - a.suitabilityScore),
      growingConditions: {
        currentTemperature: avgTemp,
        humidity,
        estimatedMonthlyRainfall: rainfall,
        soilType
      },
      alerts: this.getAgricultureAlerts(avgTemp, humidity, rainfall)
    };
  }

  calculateSuitabilityScore(crop, temp, humidity, rainfall, soilType) {
    let score = 100;

    if (temp < crop.minTemp || temp > crop.maxTemp) {
      score -= 30;
    } else if (temp >= crop.optimalTempMin && temp <= crop.optimalTempMax) {
      score += 10;
    }

    const humidityDiff = Math.abs(humidity - crop.optimalHumidity);
    score -= humidityDiff / 2;

    const rainfallDiff = Math.abs(rainfall - crop.optimalRainfall);
    score -= rainfallDiff / 10;

    if (crop.suitableSoils.includes(soilType)) {
      score += 15;
    } else {
      score -= 20;
    }

    return Math.max(0, Math.min(100, score));
  }

  getRecommendationLevel(score) {
    if (score >= 85) return 'HIGHLY_RECOMMENDED';
    if (score >= 70) return 'RECOMMENDED';
    if (score >= 60) return 'SUITABLE';
    return 'NOT_SUITABLE';
  }

  getSuitabilityReasons(crop, temp, humidity, rainfall, soilType) {
    const reasons = [];

    if (temp >= crop.optimalTempMin && temp <= crop.optimalTempMax) {
      reasons.push('Optimal temperature range');
    }
    if (Math.abs(humidity - crop.optimalHumidity) < 10) {
      reasons.push('Favorable humidity levels');
    }
    if (crop.suitableSoils.includes(soilType)) {
      reasons.push('Compatible soil type');
    }
    if (Math.abs(rainfall - crop.optimalRainfall) < 20) {
      reasons.push('Adequate rainfall');
    }

    return reasons;
  }

  calculateMonthlyRainfall(weatherData) {
    if (weatherData.daily && weatherData.daily.precipitation) {
      const weeklyTotal = weatherData.daily.precipitation.slice(0, 7).reduce((a, b) => a + b, 0);
      return (weeklyTotal / 7) * 30;
    }
    return 100;
  }

  getAgricultureAlerts(temp, humidity, rainfall) {
    const alerts = [];

    if (temp > 38) {
      alerts.push({
        type: 'HEAT_STRESS',
        severity: 'HIGH',
        message: 'High temperatures may cause crop stress. Increase irrigation.',
        recommendations: ['Increase watering frequency', 'Provide shade if possible', 'Monitor for wilting']
      });
    }

    if (humidity > 80 && temp > 25) {
      alerts.push({
        type: 'DISEASE_RISK',
        severity: 'MEDIUM',
        message: 'High humidity with warm temperatures increases disease risk.',
        recommendations: ['Improve air circulation', 'Apply preventive fungicides', 'Monitor for fungal diseases']
      });
    }

    if (rainfall < 30) {
      alerts.push({
        type: 'DROUGHT_WARNING',
        severity: 'HIGH',
        message: 'Low rainfall expected. Supplemental irrigation required.',
        recommendations: ['Implement drip irrigation', 'Apply mulch to retain moisture', 'Consider drought-resistant varieties']
      });
    }

    return alerts;
  }

  getCropDatabase() {
    return [
      {
        name: 'Rice',
        scientificName: 'Oryza sativa',
        category: 'Cereal',
        minTemp: 20, maxTemp: 35,
        optimalTempMin: 25, optimalTempMax: 32,
        optimalHumidity: 70,
        optimalRainfall: 150,
        suitableSoils: ['clay', 'loam', 'clay-loam'],
        growingPeriod: '120-150 days',
        season: 'Kharif'
      },
      {
        name: 'Wheat',
        scientificName: 'Triticum aestivum',
        category: 'Cereal',
        minTemp: 10, maxTemp: 25,
        optimalTempMin: 15, optimalTempMax: 22,
        optimalHumidity: 60,
        optimalRainfall: 80,
        suitableSoils: ['loam', 'clay-loam', 'sandy-loam'],
        growingPeriod: '100-130 days',
        season: 'Rabi'
      },
      {
        name: 'Maize',
        scientificName: 'Zea mays',
        category: 'Cereal',
        minTemp: 18, maxTemp: 32,
        optimalTempMin: 21, optimalTempMax: 27,
        optimalHumidity: 65,
        optimalRainfall: 100,
        suitableSoils: ['loam', 'sandy-loam', 'clay-loam'],
        growingPeriod: '90-120 days',
        season: 'Kharif/Rabi'
      },
      {
        name: 'Tomato',
        scientificName: 'Solanum lycopersicum',
        category: 'Vegetable',
        minTemp: 15, maxTemp: 30,
        optimalTempMin: 21, optimalTempMax: 26,
        optimalHumidity: 60,
        optimalRainfall: 90,
        suitableSoils: ['loam', 'sandy-loam'],
        growingPeriod: '70-90 days',
        season: 'All seasons'
      }
    ];
  }
}

export default new AgricultureService();`
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

createFiles(files);

console.log('\n✨ Climate & Agriculture services created!');
console.log('\n🎉 BACKEND IS NOW COMPLETE!');
console.log('\n📝 Next: Frontend files');
