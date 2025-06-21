import axios from 'axios';
import { ENDPOINTS, ApiResponse, getFullImageUrl } from '../config/api.config';

// Define interfaces for data models
export interface Category {
  _id: string;       // MongoDB uses string IDs
  name: string;
  description: string | null;
  imageUrl: string | null;
  subCategories?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to transform response data
const transformCategory = (category: unknown): Category => {
  if (
    typeof category === 'object' &&
    category !== null &&
    '_id' in category &&
    'name' in category &&
    'description' in category &&
    'imageUrl' in category
  ) {
    const cat = category as {
      _id: string;
      name: string;
      description: string | null;
      imageUrl: string | null;
      subCategories?: unknown[];
      createdAt?: string;
      updatedAt?: string;
    };
    return {
      ...cat,
      imageUrl: getFullImageUrl(cat.imageUrl)
    };
  }
  throw new Error('Invalid category object');
};

export const categoryService = {
  async getCategories() {
    try {
      const response = await axios.get<ApiResponse<Category[]>>(ENDPOINTS.CATEGORIES);
      
      // Transform the data to ensure image URLs are complete
      if (response.data.success && Array.isArray(response.data.data)) {
        response.data.data = response.data.data.map(transformCategory);
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getCategoryById(id: string) {
    try {
      const response = await axios.get<ApiResponse<Category>>(ENDPOINTS.CATEGORY_BY_ID(id));
      
      // Transform the data to ensure image URL is complete
      if (response.data.success && response.data.data) {
        response.data.data = transformCategory(response.data.data);
      }
      
      return response;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  async createCategory(formData: FormData) {
    try {
      // Log the form data for debugging
      console.log('Creating category with form data:');
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post<ApiResponse<Category>>(
        ENDPOINTS.CATEGORIES, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Transform the data to ensure image URL is complete
      if (response.data.success && response.data.data) {
        response.data.data = transformCategory(response.data.data);
      }
      
      return response;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async updateCategory(id: string, formData: FormData) {
    try {
      // Log the form data for debugging
      console.log(`Updating category ${id} with form data:`);
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.put<ApiResponse<Category>>(
        ENDPOINTS.CATEGORY_BY_ID(id), 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Transform the data to ensure image URL is complete
      if (response.data.success && response.data.data) {
        response.data.data = transformCategory(response.data.data);
      }
      
      return response;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  async deleteCategory(id: string) {
    try {
      console.log(`Deleting category with ID ${id}`);
      return await axios.delete<ApiResponse<null>>(ENDPOINTS.CATEGORY_BY_ID(id));
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
};
