import NodeCache from 'node-cache';
import CachedData from '../models/CachedData.js';

const memoryCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

class CacheService {
  constructor() {
    this.TTL = parseInt(process.env.CACHE_TTL) || 300;
  }

  generateKey(type, params) {
    const sortedParams = Object.keys(params).sort().map(key => `${key}:${params[key]}`).join('|');
    return `${type}:${sortedParams}`;
  }

  async get(key) {
    const memoryData = memoryCache.get(key);
    if (memoryData) {
      console.log(`Cache HIT (Memory): ${key}`);
      return memoryData;
    }

    try {
      const cachedData = await CachedData.findOne({
        cacheKey: key,
        expiresAt: { $gt: new Date() }
      });

      if (cachedData) {
        console.log(`Cache HIT (MongoDB): ${key}`);
        memoryCache.set(key, cachedData.data, this.TTL);
        return cachedData.data;
      }
    } catch (error) {
      console.error('MongoDB cache read error:', error.message);
    }

    console.log(`Cache MISS: ${key}`);
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
      console.log(`Cache SET: ${key}`);
    } catch (error) {
      console.error('MongoDB cache write error:', error.message);
    }
  }

  async clear(key) {
    memoryCache.del(key);
    try {
      await CachedData.deleteOne({ cacheKey: key });
      console.log(`Cache CLEARED: ${key}`);
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

export default new CacheService();