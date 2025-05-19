// API Configuration for MERN Backend

// Base URL for the API
export const API_BASE_URL = 'http://localhost:4000/api';

// Endpoints for different resources
export const ENDPOINTS = {
  // Category endpoints
  CATEGORIES: `${API_BASE_URL}/categories`,
  CATEGORY_BY_ID: (id: string) => `${API_BASE_URL}/categories/${id}`,
  
  // Subcategory endpoints
  SUBCATEGORIES: `${API_BASE_URL}/subcategories`,
  SUBCATEGORY_BY_ID: (id: string) => `${API_BASE_URL}/subcategories/${id}`,
  SUBCATEGORIES_BY_CATEGORY: (categoryId: string) => `${API_BASE_URL}/subcategories/category/${categoryId}`,
  
  // File upload endpoint
  UPLOAD: `${API_BASE_URL}/upload`,
  
  // Image URL prefix - used to construct full image URLs
  IMAGE_URL_PREFIX: 'http://localhost:4000/'
};

// Response format helpers
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  error?: string | null;
}

// Helper function to construct full image URL
export const getFullImageUrl = (relativePath: string | null): string => {
  if (!relativePath) return '';
  
  // If the path already includes the full URL, return it as is
  if (relativePath.startsWith('http')) {
    return relativePath;
  }
  
  // Otherwise, prepend the image URL prefix
  return `${ENDPOINTS.IMAGE_URL_PREFIX}${relativePath}`;
};
