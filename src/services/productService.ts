import axios from 'axios';

// API base URL for products
const API_BASE_URL = 'http://localhost:4000/api/Product';

// Interface for API response
interface ApiResponse {
  succeeded: boolean;
  data: any;
  message: string;
  errors: string[] | null;
}

// Product service object
export const productService = {
  // Get all products
  async getProducts(queryParams: string = '') {
    // Add a limit parameter to ensure we get all products
    const separator = queryParams.includes('?') ? '&' : '?';
    // Use a very large limit to ensure we get all products
    const url = `${API_BASE_URL}/GetAll${queryParams}${separator}limit=1000`;
    console.log('Fetching products from:', url);

    try {
      console.log('Making API request to get all products...');
      const response = await axios.get<ApiResponse>(url);

      // Log the full response for debugging
      console.log('GetAll Products API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });

      // Log the products data specifically
      if (response.data && response.data.succeeded) {
        console.log(`Successfully retrieved ${response.data.data.length} products`);
        console.log('First product sample:', response.data.data[0]);
      } else {
        console.error('API request succeeded but returned an error:', response.data?.message);
      }

      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw error;
    }
  },

  // Get product by ID
  async getProductById(id: number) {
    return axios.get<ApiResponse>(`${API_BASE_URL}/Get/${id}`);
  },

  // Create product
  async createProduct(formData: FormData) {
    console.log('Creating product with form data');

    try {
      // Log form data entries for debugging
      console.log('Form data entries:');
      for (const pair of formData.entries()) {
        if (pair[0] === 'image') {
          console.log(pair[0], 'File:', (pair[1] as File).name, 'Size:', (pair[1] as File).size, 'Type:', (pair[1] as File).type);
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      // Send the request
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/Create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Create product response:', response.data);
      return response;
    } catch (error: any) {
      console.error('Error creating product:', error.message);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw error;
    }
  },

  // Create product with JSON
  async createProductJson(productData: any) {
    console.log('Creating product with JSON data:', productData);

    try {
      // Send the request
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/Create`, productData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error: any) {
      console.error('Error creating product:', error.message);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },

  // Update product
  async updateProduct(id: string | number, formData: FormData) {
    // Make sure the ID is included in the form data
    formData.append('id', id.toString());

    console.log('Updating product with ID:', id);
    console.log('Form data entries:');
    for (const pair of formData.entries()) {
      if (pair[0] === 'image') {
        console.log(pair[0], 'File:', (pair[1] as File).name, 'Size:', (pair[1] as File).size, 'Type:', (pair[1] as File).type);
      } else {
        console.log(pair[0], pair[1]);
      }
    }

    try {
      const response = await axios.put<ApiResponse>(`${API_BASE_URL}/Update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Update response:', response.data);
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id: string | number) {
    console.log('Deleting product with ID:', id);

    try {
      const response = await axios.delete<ApiResponse>(`${API_BASE_URL}/Delete`, {
        data: { id: id }
      });

      console.log('Delete response:', response.data);
      return response;
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw error;
    }
  },

  // Test connection to the server
  async testConnection() {
    try {
      const response = await axios.get(`${API_BASE_URL}/GetAll`);
      return response.status === 200;
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  }
};

export default productService;
