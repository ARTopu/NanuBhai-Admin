import axios from 'axios';
import { ENDPOINTS, ApiResponse, getFullImageUrl } from '../config/api.config';

// Define interfaces for data models
export interface SubCategory {
  _id: string;       // MongoDB uses string IDs
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryId: string; // Reference to category in MongoDB
  categoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to transform response data
const transformSubCategory = (subCategory: SubCategory): SubCategory => {
  return {
    ...subCategory,
    imageUrl: getFullImageUrl(subCategory.imageUrl)
  };
};

export const subCategoryService = {
  async getSubCategories() {
    try {
      const response = await axios.get<ApiResponse<SubCategory[]>>(ENDPOINTS.SUBCATEGORIES);
      
      // Transform the data to ensure image URLs are complete
      if (response.data.success && Array.isArray(response.data.data)) {
        response.data.data = response.data.data.map(transformSubCategory);
      }
      
      return response;
    } catch (error: unknown) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  },

  async getSubCategoryById(id: string) {
    try {
      const response = await axios.get<ApiResponse<SubCategory>>(ENDPOINTS.SUBCATEGORY_BY_ID(id));
      
      // Transform the data to ensure image URL is complete
      if (response.data.success && response.data.data) {
        response.data.data = transformSubCategory(response.data.data);
      }
      
      return response;
    } catch (error: unknown) {
      console.error(`Error fetching subcategory ${id}:`, error);
      throw error;
    }
  },

  async getSubCategoriesByCategory(categoryId: string) {
    try {
      const response = await axios.get<ApiResponse<SubCategory[]>>(
        ENDPOINTS.SUBCATEGORIES_BY_CATEGORY(categoryId)
      );
      
      // Transform the data to ensure image URLs are complete
      if (response.data.success && Array.isArray(response.data.data)) {
        response.data.data = response.data.data.map(transformSubCategory);
      }
      
      return response;
    } catch (error: unknown) {
      console.error(`Error fetching subcategories for category ${categoryId}:`, error);
      throw error;
    }
  },

  async createSubCategory(formData: FormData) {
    try {
      // Log the form data for debugging
      console.log('Creating subcategory with form data:');
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post<ApiResponse<SubCategory>>(
        ENDPOINTS.SUBCATEGORIES, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Transform the data to ensure image URL is complete
      if (response.data.success && response.data.data) {
        response.data.data = transformSubCategory(response.data.data);
      }
      
      return response;
    } catch (error: unknown) {
      console.error('Error creating subcategory:', error);
      throw error;
    }
  },

  async updateSubCategory(id: string, formData: FormData) {
    try {
      // Log the form data for debugging
      console.log(`Updating subcategory ${id} with form data:`);
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.put<ApiResponse<SubCategory>>(
        ENDPOINTS.SUBCATEGORY_BY_ID(id), 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Transform the data to ensure image URL is complete
      if (response.data.success && response.data.data) {
        response.data.data = transformSubCategory(response.data.data);
      }
      
      return response;
    } catch (error: unknown) {
      console.error(`Error updating subcategory ${id}:`, error);
      throw error;
    }
  },

  async deleteSubCategory(id: string) {
    try {
      console.log(`Deleting subcategory with ID ${id}`);
      return await axios.delete<ApiResponse<null>>(ENDPOINTS.SUBCATEGORY_BY_ID(id));
    } catch (error: unknown) {
      console.error(`Error deleting subcategory ${id}:`, error);
      throw error;
    }
  }
};
