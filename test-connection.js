// Simple script to test connection to the backend
const http = require('http');

// Configuration
const HOST = 'localhost';
const PORT = 4000;

console.log(`Testing connection to ${HOST}:${PORT}...`);

// Create a simple HTTP request
const req = http.request({
  host: HOST,
  port: PORT,
  path: '/',
  method: 'GET',
  timeout: 5000 // 5 second timeout
}, (res) => {
  console.log(`Response status code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data:', data.substring(0, 200) + (data.length > 200 ? '...' : ''));
    console.log('✅ Connection successful!');
  });
});

req.on('error', (error) => {
  console.error('❌ Connection failed:', error.message);
  
  if (error.code === 'ECONNREFUSED') {
    console.error('The server is not running or not accepting connections on this port.');
    console.error('Make sure your backend server is running on port 4000.');
  } else if (error.code === 'ETIMEDOUT') {
    console.error('Connection timed out. The server might be running but is not responding.');
  }
  
  // Provide troubleshooting tips
  console.log('\nTroubleshooting tips:');
  console.log('1. Make sure your backend server is running');
  console.log('2. Check if the server is running on the correct port (4000)');
  console.log('3. Look for error messages in your server console');
  console.log('4. Try restarting your server');
});

req.on('timeout', () => {
  console.error('❌ Request timed out');
  req.destroy();
});

// Send the request
req.end();
