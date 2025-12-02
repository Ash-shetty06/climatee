# Weather, Climate & AQI Intelligence Platform

A comprehensive environmental monitoring platform built with MERN stack.

## Features

- 🌤️ **Real-time Weather**: Current conditions + 7-day forecast
- 💨 **Air Quality Monitoring**: AQI + detailed pollutant breakdown
- 📊 **Climate Analytics**: Historical data analysis & future projections
- 🌾 **Agriculture Insights**: Crop recommendations based on local conditions
- 🗺️ **Interactive Maps**: Visualize weather & AQI data geographically

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Multiple Weather APIs (Open-Meteo, WeatherAPI, Visual Crossing)
- AQI APIs (AQICN, OpenAQ)
- Redis caching (optional)

**Frontend:**
- React 18 + Vite
- Leaflet for maps
- ApexCharts for data visualization
- Axios for API calls

## Installation

### Prerequisites
- Node.js v18+
- MongoDB v6+

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Edit with your API keys
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weather-intelligence
NODE_ENV=development

WEATHERAPI_KEY=your_key_here
VISUAL_CROSSING_KEY=your_key_here
AQICN_KEY=your_key_here
NOAA_TOKEN=your_token_here
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_MAPTILER_API_KEY=your_key_here
```

## API Endpoints

### Weather
- `GET /api/weather/current?lat={lat}&lon={lon}`

### Air Quality
- `GET /api/aqi/current?lat={lat}&lon={lon}`

### Climate
- `GET /api/climate/historical?lat={lat}&lon={lon}&startDate={date}&endDate={date}`
- `GET /api/climate/projections?lat={lat}&lon={lon}&scenario={rcp}`

### Agriculture
- `GET /api/agriculture/recommendations?lat={lat}&lon={lon}&soilType={type}`

## Features in Detail

### Weather Module
- Current conditions with feels-like temperature
- 48-hour hourly forecast
- 7-day daily forecast
- Severe weather alerts
- Multiple data source fallback

### AQI Module
- Real-time air quality index
- PM2.5, PM10, NO2, SO2, CO, O3 levels
- Health advisories for general population & sensitive groups
- Color-coded severity indicators

### Climate Module
- Historical temperature & precipitation trends
- Anomaly detection
- Linear regression trend analysis
- IPCC-based climate projections (RCP scenarios)
- Impact assessments

### Agriculture Module
- Crop suitability analysis
- Soil type compatibility
- Growing season recommendations
- Weather-based alerts (heat stress, disease risk, drought warnings)

## Project Structure

```
weather-air-service/
├── backend/
│   ├── config/         # Database configuration
│   ├── models/         # Mongoose schemas
│   ├── services/       # Business logic & API integrations
│   ├── routes/         # Express routes
│   ├── middleware/     # Error handling, rate limiting
│   ├── utils/          # Helper functions
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── services/   # API client
│   │   ├── utils/      # Helper functions
│   │   └── App.jsx     # Main app component
│   └── index.html
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License

## Acknowledgments

- Open-Meteo API
- WeatherAPI
- AQICN
- OpenAQ
- NOAA Climate Data
- OpenStreetMap & Leaflet
