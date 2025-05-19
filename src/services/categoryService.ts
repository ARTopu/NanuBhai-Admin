import axios from 'axios';

// Try different URLs to find one that works
const API_BASE_URLS = [
  'http://localhost:4000/api/Category',  // Standard HTTP
  'https://localhost:4000/api/Category', // HTTPS version
  'http://127.0.0.1:4000/api/Category',  // Using IP instead of localhost
  'http://localhost:4000/api/category',  // Lowercase version
  'http://localhost:4000/api/categories' // Plural version
];

// Start with the first URL
let API_BASE_URL = API_BASE_URLS[0];

// Function to test all URLs and find one that works
async function findWorkingURL() {
  console.log('Testing all possible API URLs...');

  for (const url of API_BASE_URLS) {
    try {
      console.log(`Testing URL: ${url}/GetAll`);
      const response = await fetch(`${url}/GetAll`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        console.log(`✅ URL ${url} works!`);
        API_BASE_URL = url;
        return true;
      } else {
        console.log(`❌ URL ${url} returned status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ URL ${url} failed: ${error.message}`);
    }
  }

  console.error('❌ None of the URLs worked');
  return false;
}

// Try to find a working URL when the module loads
findWorkingURL().then(success => {
  if (success) {
    console.log(`Using API URL: ${API_BASE_URL}`);
  } else {
    console.error('Could not find a working API URL');
  }
});

// No authentication is needed for this application

// Define interfaces for API responses
interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  subCategories: any[];
}

interface ApiResponse {
  succeeded: boolean;
  data: Category[] | Category;
  message: string;
  errors: string[] | null;
}

// Function to test server connectivity with multiple approaches
export async function testServerConnectivity() {
  console.log('Testing server connectivity with multiple approaches...');

  // Try multiple approaches to connect to the server
  const approaches = [
    // Approach 1: Direct axios call
    async () => {
      console.log('Approach 1: Direct axios call to http://localhost:4000/');
      try {
        const response = await axios.get('http://localhost:4000/', {
          timeout: 5000, // 5 second timeout
        });
        console.log('Approach 1 succeeded! Status:', response.status);
        return true;
      } catch (error: any) {
        console.error('Approach 1 failed:', error.message);
        return false;
      }
    },

    // Approach 2: Using fetch API
    async () => {
      console.log('Approach 2: Using fetch API to http://localhost:4000/');
      try {
        const response = await fetch('http://localhost:4000/', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'text/html,application/json',
          },
        });
        console.log('Approach 2 succeeded! Status:', response.status);
        return true;
      } catch (error: any) {
        console.error('Approach 2 failed:', error.message);
        return false;
      }
    },

    // Approach 3: Try with HTTPS
    async () => {
      console.log('Approach 3: Try with HTTPS to https://localhost:4000/');
      try {
        // Skip this approach in the browser environment
        if (typeof window !== 'undefined') {
          console.log('Skipping HTTPS approach in browser environment');
          return false;
        }

        const response = await axios.get('https://localhost:4000/', {
          timeout: 5000,
          // This would work in Node.js but not in the browser
          // httpsAgent: new (require('https').Agent)({
          //   rejectUnauthorized: false
          // })
        });
        console.log('Approach 3 succeeded! Status:', response.status);
        return true;
      } catch (error: any) {
        console.error('Approach 3 failed:', error.message);
        return false;
      }
    },

    // Approach 4: Try with 127.0.0.1 instead of localhost
    async () => {
      console.log('Approach 4: Using 127.0.0.1 instead of localhost');
      try {
        const response = await axios.get('http://127.0.0.1:4000/', {
          timeout: 5000,
        });
        console.log('Approach 4 succeeded! Status:', response.status);
        return true;
      } catch (error: any) {
        console.error('Approach 4 failed:', error.message);
        return false;
      }
    },

    // Approach 5: Try the test endpoint
    async () => {
      console.log('Approach 5: Try the test endpoint at http://localhost:4000/api/test');
      try {
        const response = await axios.get('http://localhost:4000/api/test', {
          timeout: 5000,
        });
        console.log('Approach 5 succeeded! Response:', response.data);
        return true;
      } catch (error: any) {
        console.error('Approach 5 failed:', error.message);
        return false;
      }
    }
  ];

  // Try each approach
  for (const approach of approaches) {
    try {
      const result = await approach();
      if (result) {
        console.log('Server connectivity test passed!');
        return true;
      }
    } catch (error) {
      console.error('Error in connectivity test:', error);
    }
  }

  console.error('All connectivity approaches failed!');
  return false;
}

export const categoryService = {
  // Test if the server is reachable
  async testConnection() {
    return testServerConnectivity();
  },

  async getCategories() {
    console.log('Fetching categories...');

    // Try multiple approaches to get categories
    try {
      // Approach 1: Using axios with the current API_BASE_URL
      console.log(`Trying axios with ${API_BASE_URL}/GetAll`);
      return await axios.get<ApiResponse>(`${API_BASE_URL}/GetAll`);
    } catch (error) {
      console.error('Axios approach failed:', error.message);

      // Approach 2: Try to find a working URL first
      console.log('Trying to find a working URL...');
      const found = await findWorkingURL();

      if (found) {
        console.log(`Found working URL: ${API_BASE_URL}, trying again...`);
        return await axios.get<ApiResponse>(`${API_BASE_URL}/GetAll`);
      }

      // Approach 3: Try fetch API as a fallback
      console.log('Trying fetch API as fallback...');
      try {
        const response = await fetch(`${API_BASE_URL}/GetAll`);
        const data = await response.json();

        // Convert fetch response to axios-like response
        return {
          data: data,
          status: response.status,
          statusText: response.statusText,
          headers: {},
          config: {},
        };
      } catch (fetchError) {
        console.error('Fetch approach also failed:', fetchError.message);

        // If all approaches fail, throw the original error
        throw error;
      }
    }
  },

  async createCategory(formData: FormData) {
    // Log the form data for debugging
    console.log('Creating category with form data:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      // Make sure we're using the correct URL
      const url = `${API_BASE_URL}/Create`;
      console.log('Sending request to:', url);

      // Try with different content types
      console.log('Trying with multipart/form-data content type...');

      // Add detailed request logging
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Log request and response details
        onUploadProgress: (progressEvent: any) => {
          console.log('Upload progress:', Math.round((progressEvent.loaded * 100) / progressEvent.total), '%');
        },
      };

      console.log('Request config:', config);

      // Send the complete form data including image if available
      console.log('Sending complete form data with all fields');

      // Create a new FormData to ensure proper formatting
      const completeData = new FormData();

      // Add the basic fields
      completeData.append('name', formData.get('name') as string);
      completeData.append('description', formData.get('description') as string);

      // Check if we have an image
      const hasImage = formData.get('hasImage') === 'true';
      console.log('Has image:', hasImage);

      if (hasImage && formData.get('image')) {
        console.log('Including image in request');
        completeData.append('image', formData.get('image') as Blob, 'category-image.jpg');
      }

      // Send the request with the complete data
      const response = await axios.post<ApiResponse>(url, completeData, config);

      console.log('Response received:', response.data);
      return response;
    } catch (error: any) {
      console.error('Error in createCategory:', error.message);

      // Detailed error logging
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        console.error('Error response data:', error.response.data);

        // Try to parse the error response if it's HTML
        if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
          console.error('Received HTML error response - server might be returning an error page');
          console.error('First 200 characters of HTML:', error.response.data.substring(0, 200));
        }
      } else if (error.request) {
        console.error('No response received from server. Request details:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }

      // Try an alternative approach if the first one fails
      try {
        console.log('First approach failed. Trying with application/json content type...');

        // Extract data from FormData and send as JSON
        // For JSON approach, we can't include the actual image file,
        // but we can indicate that an image should be expected in a multipart request
        const jsonData = {
          name: formData.get('name'),
          description: formData.get('description'),
          hasImage: formData.get('hasImage') === 'true'
        };

        console.log('Sending JSON data:', jsonData);
        const jsonResponse = await axios.post<ApiResponse>(url, jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('JSON approach succeeded:', jsonResponse.data);
        return jsonResponse;
      } catch (jsonError: any) {
        console.error('JSON approach also failed:', jsonError.message);
        if (jsonError.response) {
          console.error('JSON error response:', jsonError.response.data);
        }
      }

      throw error;
    }
  },

  getUpdateEndpoint() {
    // Use the correct endpoint that worked
    return `${API_BASE_URL}/Update`;
  },

  async updateCategory(id: number, formData: FormData) {
    // Make sure the ID is included in the form data
    formData.append('id', id.toString());  // Changed from 'Id' to 'id' to match backend expectations

    // Get the correct endpoint
    const endpoint = this.getUpdateEndpoint();
    console.log('Using update endpoint:', endpoint);
    console.log('Form data entries:');
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Try multiple approaches for the update request
    try {
      // Approach 1: PUT with multipart/form-data
      console.log('Approach 1: PUT with multipart/form-data');
      return await axios.put<ApiResponse>(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error: any) {
      console.error('Update approach 1 failed:', error.message);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }

      // Approach 2: Try with JSON
      try {
        console.log('Approach 2: PUT with JSON');
        const jsonData = {
          id: id,
          name: formData.get('name'),
          description: formData.get('description')
        };
        console.log('JSON data:', jsonData);

        return await axios.put<ApiResponse>(endpoint, jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error2: any) {
        console.error('Update approach 2 failed:', error2.message);
        if (error2.response) {
          console.error('Error response:', error2.response.data);
        }

        // Approach 3: Try with POST instead of PUT
        try {
          console.log('Approach 3: POST with multipart/form-data');
          return await axios.post<ApiResponse>(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (error3: any) {
          console.error('Update approach 3 failed:', error3.message);
          if (error3.response) {
            console.error('Error response:', error3.response.data);
          }

          throw error; // Throw the original error
        }
      }
    }
  },

  getDeleteEndpoint() {
    // Return the correct endpoint for delete
    return `${API_BASE_URL}/Delete`;
  },

  async deleteCategory(id: number) {
    // Use the correct endpoint and approach that worked
    const endpoint = this.getDeleteEndpoint();
    console.log(`Deleting category with ID ${id} from ${endpoint}`);

    // Try multiple approaches for the delete request
    try {
      // Approach 1: Send ID in the request body
      console.log('Approach 1: Sending ID in request body');
      return await axios.delete<ApiResponse>(endpoint, {
        data: { id: id }
      });
    } catch (error: any) {
      console.error('Delete approach 1 failed:', error.message);

      // Approach 2: Try sending ID as a URL parameter
      try {
        console.log('Approach 2: Sending ID as URL parameter');
        return await axios.delete<ApiResponse>(`${API_BASE_URL}/${id}`);
      } catch (error2: any) {
        console.error('Delete approach 2 failed:', error2.message);

        // Approach 3: Try with form data
        try {
          console.log('Approach 3: Using form data');
          const formData = new FormData();
          formData.append('id', id.toString());

          return await axios.delete<ApiResponse>(endpoint, {
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } catch (error3: any) {
          console.error('Delete approach 3 failed:', error3.message);
          throw error; // Throw the original error
        }
      }
    }
  }
};
