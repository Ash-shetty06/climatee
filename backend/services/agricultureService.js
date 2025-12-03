import cacheService from './cacheService.js';

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

export default new AgricultureService();