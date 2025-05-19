// A minimal Express server with CORS enabled
const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Enable CORS for all routes and origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString()
  });
});

// Categories route
app.get('/api/Category/GetAll', (req, res) => {
  res.json({
    succeeded: true,
    data: [
      {
        id: 1,
        name: 'Test Category 1',
        description: 'This is a test category',
        imageUrl: null
      },
      {
        id: 2,
        name: 'Test Category 2',
        description: 'This is another test category',
        imageUrl: null
      }
    ],
    message: 'Categories retrieved successfully',
    errors: null
  });
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Minimal test server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});
