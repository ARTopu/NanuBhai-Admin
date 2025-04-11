import axios from 'axios';

const API_BASE_URL = 'https://localhost:7293/api/Category';

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

export const categoryService = {
  async getCategories() {
    return axios.get<ApiResponse>(`${API_BASE_URL}/GetAll`);
  },

  async createCategory(formData: FormData) {
    return axios.post<ApiResponse>(`${API_BASE_URL}/Create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getUpdateEndpoint() {
    // Use the correct endpoint that worked
    return `${API_BASE_URL}/Update`;
  },

  async updateCategory(id: number, formData: FormData) {
    // Make sure the ID is included in the form data
    formData.append('Id', id.toString());

    // Get the correct endpoint
    const endpoint = this.getUpdateEndpoint();
    console.log('Using update endpoint:', endpoint);

    // Use the approach that worked (PUT with multipart/form-data)
    return axios.put<ApiResponse>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getDeleteEndpoint() {
    // Return the correct endpoint for delete
    return `${API_BASE_URL}/Delete`;
  },

  async deleteCategory(id: number) {
    // Use the correct endpoint and approach that worked
    const endpoint = this.getDeleteEndpoint();
    console.log(`Deleting category with ID ${id} from ${endpoint}`);

    // Send DELETE request with ID in the request body
    return axios.delete<ApiResponse>(endpoint, {
      data: { id: id }
    });
  }
};
