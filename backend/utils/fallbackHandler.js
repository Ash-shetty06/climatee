import ErrorLog from '../models/ErrorLog.js';

class FallbackHandler {
  async executeWithFallback(apiCalls, dataType) {
    const errors = [];

    for (let i = 0; i < apiCalls.length; i++) {
      const { name, call } = apiCalls[i];
      
      try {
        console.log(`Attempting ${dataType} API: ${name} (${i + 1}/${apiCalls.length})`);
        const result = await call();
        
        if (result && result.data) {
          console.log(`✓ Success with ${name}`);
          return {
            data: result.data,
            source: name,
            fallbackUsed: i > 0
          };
        }
      } catch (error) {
        console.error(`✗ ${name} failed:`, error.message);
        errors.push({ apiName: name, error: error.message });
        await this.logError(name, error, dataType);
        continue;
      }
    }

    throw new Error(`All ${dataType} APIs failed: ${errors.map(e => e.apiName).join(', ')}`);
  }

  async logError(apiName, error, dataType) {
    try {
      await ErrorLog.create({
        errorType: 'API_FAILURE',
        apiName,
        endpoint: dataType,
        errorMessage: error.message,
        errorStack: error.stack,
        severity: 'HIGH'
      });
    } catch (logError) {
      console.error('Failed to log error:', logError.message);
    }
  }
}

export default new FallbackHandler();