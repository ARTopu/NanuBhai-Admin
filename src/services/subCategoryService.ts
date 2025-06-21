import axios from 'axios';

const API_BASE_URL = 'https://localhost:7293/api/SubCategory';

// Define interfaces for API responses
interface SubCategory {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryId: number;
  categoryName?: string;
}

interface ApiResponse {
  succeeded: boolean;
  data: SubCategory[] | SubCategory | number; // API might return just the ID
  message: string;
  errors: string[] | null;
}

export const subCategoryService = {
  async getSubCategories() {
    return axios.get<ApiResponse>(`${API_BASE_URL}/GetAll`);
  },

  async createSubCategory(formData: FormData) {
    // Exactly match the categoryService approach
    return axios.post<ApiResponse>(`${API_BASE_URL}/Create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async updateSubCategory(id: number, formData: FormData) {
    // Extract data from FormData to create a JSON object
    const subCategoryData: Record<string, unknown> = {
      id: id,
      name: formData.get('Name') || '',
      description: formData.get('Description') || '',
      categoryId: parseInt(formData.get('CategoryId')?.toString() || '0')
    };

    // Log the data we're sending
    console.log('SubCategoryService - updateSubCategory - Data being sent:', subCategoryData);

    // First, try to update the basic data using JSON
    try {
      // Step 1: Update the basic data (id, name, description, categoryId)
      console.log('Step 1: Updating basic subcategory data...');
      const jsonResponse = await axios.put<ApiResponse>(`${API_BASE_URL}/Update`, subCategoryData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Basic data update response:', jsonResponse.data);

      // If there's an image, upload it separately
      const imageFile = formData.get('image') as File;
      if (imageFile) {
        console.log('Step 2: Uploading image for subcategory...');

        // Create a new FormData just for the image
        const imageFormData = new FormData();
        imageFormData.append('Id', id.toString());
        imageFormData.append('image', imageFile);

        // Upload the image
        const imageResponse = await axios.put<ApiResponse>(`${API_BASE_URL}/UpdateImage`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Image update response:', imageResponse.data);
      } else {
        console.log('No new image to upload');
      }

      return jsonResponse;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        console.error('Error updating subcategory:', (error as { message?: string }).message);
      } else {
        console.error('Error updating subcategory:', error);
      }
      if (error && typeof error === 'object' && 'response' in error) {
        const resp = (error as { response?: { data?: unknown } }).response;
        if (resp) {
          console.error('Error response:', resp.data);
        }
      }
      throw error;
    }
  },

  async deleteSubCategory(id: number) {
    // Exactly match the categoryService approach
    return axios.delete<ApiResponse>(`${API_BASE_URL}/Delete`, {
      data: { id: id }
    });
  }
};
