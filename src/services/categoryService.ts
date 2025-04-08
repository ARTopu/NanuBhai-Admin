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

  async updateCategory(id: number, formData: FormData) {
    return axios.put<ApiResponse>(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async deleteCategory(id: number) {
    return axios.delete<ApiResponse>(`${API_BASE_URL}/${id}`);
  }
};
