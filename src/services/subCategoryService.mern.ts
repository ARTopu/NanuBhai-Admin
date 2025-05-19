import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/subcategories';

// Define interfaces for API responses
interface SubCategory {
  _id: string;       // MongoDB uses string IDs
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryId: string; // Reference to category in MongoDB
  categoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// MERN stack typically uses a simpler response format
interface ApiResponse {
  success: boolean;  // Changed from succeeded to success (common in MERN)
  data: SubCategory[] | SubCategory | null;
  message?: string;
  error?: string | null;
}

export const subCategoryService = {
  async getSubCategories() {
    return axios.get<ApiResponse>(`${API_BASE_URL}`);
  },

  async getSubCategoryById(id: string) {
    return axios.get<ApiResponse>(`${API_BASE_URL}/${id}`);
  },

  async getSubCategoriesByCategory(categoryId: string) {
    return axios.get<ApiResponse>(`${API_BASE_URL}/category/${categoryId}`);
  },

  async createSubCategory(formData: FormData) {
    // Log the form data for debugging
    console.log('Creating subcategory with form data:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    return axios.post<ApiResponse>(`${API_BASE_URL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async updateSubCategory(id: string, formData: FormData) {
    // Log the form data for debugging
    console.log(`Updating subcategory ${id} with form data:`);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    return axios.put<ApiResponse>(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async deleteSubCategory(id: string) {
    console.log(`Deleting subcategory with ID ${id}`);
    return axios.delete<ApiResponse>(`${API_BASE_URL}/${id}`);
  }
};
