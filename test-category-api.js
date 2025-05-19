// Test script for category API
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:4000/api/Category/Create';

async function testCreateCategory() {
  try {
    console.log('Testing category creation API...');
    
    // Create form data
    const formData = new FormData();
    formData.append('name', 'Test Category');
    formData.append('description', 'This is a test category');
    
    // Try to add a test image if available
    try {
      // You can replace this with any image path on your system
      const imagePath = path.join(__dirname, 'test-image.jpg');
      if (fs.existsSync(imagePath)) {
        const imageFile = fs.createReadStream(imagePath);
        formData.append('image', imageFile);
        console.log('Added image to request');
      } else {
        console.log('No test image found at:', imagePath);
      }
    } catch (imageError) {
      console.error('Error adding image:', imageError.message);
    }
    
    // Log form data
    console.log('Form data entries:');
    for (const [key, value] of Object.entries(formData)) {
      console.log(`- ${key}: ${value}`);
    }
    
    // Send request
    console.log(`Sending POST request to ${API_URL}...`);
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    
    // Log response
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data && response.data.succeeded) {
      console.log('✅ Category created successfully!');
    } else {
      console.log('❌ Category creation failed.');
    }
    
  } catch (error) {
    console.error('Error testing API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Run the test
testCreateCategory();
