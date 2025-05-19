// Direct API test script
const http = require('http');

// Configuration
const HOST = 'localhost';
const PORT = 4000;
const PATH = '/api/Category/GetAll';

console.log(`Testing API at http://${HOST}:${PORT}${PATH}...`);

// Create a simple HTTP request
const req = http.request({
  host: HOST,
  port: PORT,
  path: PATH,
  method: 'GET',
  timeout: 5000 // 5 second timeout
}, (res) => {
  console.log(`Response status code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      // Try to parse as JSON
      const jsonData = JSON.parse(data);
      console.log('Response data (parsed as JSON):');
      console.log(JSON.stringify(jsonData, null, 2));
    } catch (e) {
      // If not JSON, show as text
      console.log('Response data (as text):');
      console.log(data.substring(0, 500) + (data.length > 500 ? '...' : ''));
    }
    console.log('✅ API test successful!');
  });
});

req.on('error', (error) => {
  console.error('❌ API test failed:', error.message);
  
  if (error.code === 'ECONNREFUSED') {
    console.error('The server is not running or not accepting connections on this port.');
    console.error('Make sure your backend server is running on port 4000.');
  } else if (error.code === 'ETIMEDOUT') {
    console.error('Connection timed out. The server might be running but is not responding.');
  }
});

req.on('timeout', () => {
  console.error('❌ Request timed out');
  req.destroy();
});

// Send the request
req.end();
