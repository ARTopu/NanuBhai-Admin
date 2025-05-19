// Simple script to test the backend API
const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:4000';

async function testBackend() {
  console.log('Testing backend API...');

  try {
    // Test 1: Check if the server is running
    console.log('\nTest 1: Checking if server is running...');
    const rootResponse = await axios.get(API_URL);
    console.log('Server is running. Response:', rootResponse.data);

    // Test 2: Create a category with minimal data
    console.log('\nTest 2: Creating a category with minimal data...');
    const createResponse = await axios.post(`${API_URL}/api/Category/Create`, {
      name: 'Test Category',
      description: 'This is a test category'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Create category response:', createResponse.data);

    // Test 3: Get all categories
    console.log('\nTest 3: Getting all categories...');
    const getAllResponse = await axios.get(`${API_URL}/api/Category/GetAll`);
    console.log('Get all categories response:', getAllResponse.data);

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error testing backend:', error.message);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    } else {
      console.error('Error setting up request:', error.message);
    }
  }
}

// Run the tests
testBackend();
