import ErrorLog from '../models/ErrorLog.js';

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  ErrorLog.create({
    errorType: 'SYSTEM_ERROR',
    endpoint: req.path,
    errorMessage: err.message,
    errorStack: err.stack,
    requestData: {
      method: req.method,
      query: req.query,
      body: req.body
    },
    severity: 'HIGH'
  }).catch(logErr => console.error('Failed to log error:', logErr));

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;