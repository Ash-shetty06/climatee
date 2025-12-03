import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './config/database.js';
import weatherRoutes from './routes/weatherRoutes.js';
import aqiRoutes from './routes/aqiRoutes.js';
import climateRoutes from './routes/climateRoutes.js';
import agricultureRoutes from './routes/agricultureRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import rateLimiter from './middleware/rateLimiter.js';

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Weather Intelligence API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/aqi', aqiRoutes);
app.use('/api/climate', climateRoutes);
app.use('/api/agriculture', agricultureRoutes);
app.use('/api/users', userRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Weather, Climate & AQI Intelligence Platform API       ║
║   Server running on port ${PORT}                             ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;