const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Verify API key is loaded
if (!process.env.OPENWEATHER_API_KEY) {
  console.error('ERROR: OPENWEATHER_API_KEY is not set in .env file');
  process.exit(1);
}

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Weather endpoint with improved error handling
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    // Validate parameters
    if (!lat || !lon) {
      return res.status(400).json({ 
        error: 'Missing parameters',
        message: 'Both lat and lon query parameters are required'
      });
    }

    // Validate coordinate format
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        error: 'Invalid parameters',
        message: 'Latitude and longitude must be numbers'
      });
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    
    // Add timeout and headers to fetch
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'DynamicWeatherApp/1.0' }
    });
    
    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: 'Weather API error',
        details: errorData
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error('Weather endpoint error:', err);
    
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Weather API timeout' });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message 
    });
  }
});

// Single catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`ℹ️  OpenWeather API key: ${process.env.OPENWEATHER_API_KEY ? 'Loaded' : 'MISSING!'}`);
});