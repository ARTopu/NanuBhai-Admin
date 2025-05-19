// simple-server.js - A minimal Express server for testing
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'Uploads', 'Category');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

// Root route for testing
app.get('/', (req, res) => {
  res.send('MERN Backend API is running...');
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    succeeded: true,
    data: { message: 'API is working correctly' },
    message: 'Test successful',
    errors: null
  });
});

// Get all categories
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

// Create category
app.post('/api/Category/Create', express.json(), (req, res) => {
  console.log('Create category request received');
  console.log('Request body:', req.body);
  
  // Simulate successful creation
  res.status(201).json({
    succeeded: true,
    data: {
      id: Math.floor(Math.random() * 1000) + 3,
      name: req.body.name || 'New Category',
      description: req.body.description || null,
      imageUrl: null
    },
    message: 'Category created successfully',
    errors: null
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the API at http://localhost:${PORT}/`);
  console.log(`Get categories at http://localhost:${PORT}/api/Category/GetAll`);
});
