import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/categories';

// Define interfaces for API responses
interface Category {
  _id: string;       // MongoDB uses string IDs
  name: string;
  description: string | null;
  imageUrl: string | null;
  subCategories?: any[];
  createdAt?: string;
  updatedAt?: string;
}

// MERN stack typically uses a simpler response format
interface ApiResponse {
  success: boolean;  // Changed from succeeded to success (common in MERN)
  data: Category[] | Category | null;
  message?: string;
  error?: string | null;
}

export const categoryService = {
  async getCategories() {
    return axios.get<ApiResponse>(`${API_BASE_URL}`);
  },

  async getCategoryById(id: string) {
    return axios.get<ApiResponse>(`${API_BASE_URL}/${id}`);
  },

  async createCategory(formData: FormData) {
    // Log the form data for debugging
    console.log('Creating category with form data:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    return axios.post<ApiResponse>(`${API_BASE_URL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async updateCategory(id: string, formData: FormData) {
    // Log the form data for debugging
    console.log(`Updating category ${id} with form data:`);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    return axios.put<ApiResponse>(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async deleteCategory(id: string) {
    console.log(`Deleting category with ID ${id}`);
    return axios.delete<ApiResponse>(`${API_BASE_URL}/${id}`);
  }
};
