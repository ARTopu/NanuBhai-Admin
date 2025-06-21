"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Select from "../form/Select";
import EditCategorySelect from "../form/EditCategorySelect";
import { useDropzone } from "react-dropzone";
import axios from 'axios';
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Image from "next/image";
import { categoryService } from "@/services/categoryService";
import { subCategoryService } from "@/services/subCategoryService";

interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

interface SubCategory {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  categoryId: number;
  categoryName?: string; // We'll add this for display purposes
}

interface EditFormState {
  categoryId: number;
  categoryName: string;
  name: string;
  description: string;
  imageUrl: string | null;
  // For backward compatibility with existing code
  subCategory?: string;
  image?: string | null;
}

export default function SubCategories() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{value: string, label: string}[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  // We'll use this in a real app when calling the API
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [subCategoryImage, setSubCategoryImage] = useState<string | null>(null);
  const [subCategoryImagePreview, setSubCategoryImagePreview] = useState<string | null>(null);
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    categoryId: 0,
    categoryName: "",
    name: "",
    description: "",
    imageUrl: null
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();

  // Fetch categories and subcategories from API
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  // Log editForm changes
  useEffect(() => {
    console.log('EditForm state changed:', editForm);
    console.log('CategoryId in editForm:', editForm.categoryId);
  }, [editForm]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoryService.getCategories();

      if (response.data && response.data.succeeded) {
        const categoriesData = response.data.data as Category[];

        // Log the raw categories data
        console.log('Raw categories data:', categoriesData);

        // Ensure all category IDs are numbers
        const processedCategories = categoriesData.map(category => ({
          ...category,
          id: typeof category.id === 'string' ? parseInt(category.id) : category.id
        }));

        setCategories(processedCategories);
        console.log('Processed categories:', processedCategories);

        // Create options for the select dropdown
        const options = processedCategories.map(category => ({
          value: category.id.toString(),
          label: category.name
        }));
        setCategoryOptions(options);
        console.log('Category options for dropdown:', options);
      } else {
        console.error("Failed to fetch categories:", response.data);
        setDeleteError('Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setDeleteError('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setIsLoading(true);
      const response = await subCategoryService.getSubCategories();

      if (response.data && response.data.succeeded) {
        const subCategoriesData = response.data.data as SubCategory[];

        // Fetch category names for each subcategory
        const enrichedSubCategories = await Promise.all(subCategoriesData.map(async (subCategory) => {
          try {
            // Get the category for this subcategory
            const categoryResponse = await categoryService.getCategories();
            if (categoryResponse.data && categoryResponse.data.succeeded) {
              const categories = categoryResponse.data.data as Category[];
              const category = categories.find(cat => cat.id === subCategory.categoryId);

              return {
                ...subCategory,
                categoryName: category ? category.name : 'Unknown Category'
              };
            }
            return subCategory;
          } catch (err) {
            console.error(`Error fetching category for subcategory ${subCategory.id}:`, err);
            return subCategory;
          }
        }));

        setSubCategories(enrichedSubCategories);
      } else {
        setDeleteError('Failed to fetch subcategories');
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setDeleteError('Failed to fetch subcategories');
    } finally {
      setIsLoading(false);
    }
  };

  // We now handle this in the fetchCategories function
  // const categoryOptions = categories.map(category => ({
  //   value: category.id.toString(),
  //   label: category.name
  // }));

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      console.log('Dropped file:', file.name, file.size, file.type);

      // Create a preview URL for display - this matches the ProductCategories approach
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setSubCategoryImage(result);
        setSubCategoryImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (selectedCategoryId && subCategory.trim()) {
      // Find the selected category name
      const category = categories.find(cat => cat.id === selectedCategoryId);
      if (!category) return;

      try {
        setIsLoading(true);

        // Create form data for API call
        const formData = new FormData();
        formData.append('CategoryId', selectedCategoryId.toString());
        formData.append('Name', subCategory.trim());
        formData.append('Description', description.trim());
        if (subCategoryImage) {
          try {
            // This matches exactly how ProductCategories handles the image
            const base64Response = await fetch(subCategoryImage);
            const blob = await base64Response.blob();
            formData.append('image', blob, 'subcategory-image.jpg');

            // Log what we're sending
            console.log('Appending image blob to FormData as \'image\'');
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }

        // Log the complete FormData
        console.log('Complete FormData:');
        for (const pair of formData.entries()) {
          if (pair[0] === 'ImageFile') {
            console.log(pair[0], 'File object:', pair[1]);
            const file = pair[1] as File;
            console.log('File name:', file.name);
            console.log('File size:', file.size);
            console.log('File type:', file.type);
          } else {
            console.log(pair[0], pair[1]);
          }
        }

        // Call the API using the service - exactly as done in ProductCategories
        console.log('Sending API request to create subcategory...');
        const response = await subCategoryService.createSubCategory(formData);
        console.log('API request completed');

        // Log the response
        console.log('API Response:', response.data);

        // Check if there are any errors related to the image
        if (response.data && !response.data.succeeded && response.data.errors) {
          console.error('API Error:', response.data.errors);
          // Look for specific error messages that might indicate the correct field name
          const errorMessages = response.data.errors;
          if (Array.isArray(errorMessages)) {
            errorMessages.forEach(error => {
              if (error.toLowerCase().includes('image') || error.toLowerCase().includes('file')) {
                console.error('Image-related error:', error);
              }
            });
          }
        }

        if (response.data && response.data.succeeded) {
          // Refresh the subcategories list
          await fetchSubCategories();

          // Reset all form fields
          setSelectedCategoryId(null);
          setSubCategory("");
          setDescription("");
          setSubCategoryImage(null);
          setSubCategoryImagePreview(null);
          form.reset(); // Reset the native form
        } else {
          const errorMessage = response.data.errors ? response.data.errors.join(', ') : 'Failed to create subcategory';
          setDeleteError(errorMessage);
        }
      } catch (err) {
        console.error('Error creating subcategory:', err);
        setDeleteError('Failed to create subcategory');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    // Clear any previous error
    setEditError(null);

    // Store the current subcategory for API calls
    setCurrentSubCategory(subCategory);

    // Process the image URL to ensure it's a string
    let safeImageUrl = "";

    if (subCategory.imageUrl) {
      // If we have an image URL from the API, use it with the base URL
      safeImageUrl = `https://localhost:7293/${subCategory.imageUrl}`;
    }

    console.log('Editing subcategory with image:', safeImageUrl);

    // Log the subcategory data to verify the categoryId
    console.log('Editing subcategory:', {
      id: subCategory.id,
      name: subCategory.name,
      categoryId: subCategory.categoryId,
      categoryName: subCategory.categoryName
    });

    // Ensure categoryId is a number
    const categoryId = typeof subCategory.categoryId === 'string' ?
      parseInt(subCategory.categoryId) : subCategory.categoryId;

    console.log('Original subcategory:', subCategory);
    console.log('CategoryId from API:', subCategory.categoryId, 'type:', typeof subCategory.categoryId);
    console.log('Converted categoryId:', categoryId, 'type:', typeof categoryId);

    // Create the edit form object
    const newEditForm = {
      categoryId: categoryId,
      categoryName: subCategory.categoryName || 'Unknown Category',
      name: subCategory.name,
      description: subCategory.description || '',
      imageUrl: safeImageUrl,
      // For backward compatibility
      subCategory: subCategory.name,
      image: safeImageUrl
    };

    // Set the edit form
    setEditForm(newEditForm);

    // Force a refresh of the category select by setting a timeout
    setTimeout(() => {
      console.log('Refreshing category select with categoryId:', categoryId);
      // This is a hack to force the select to update
      setEditForm(prev => ({ ...prev }));
    }, 100);

    // Log the edit form to verify the categoryId was set correctly
    console.log('Edit form initialized with:', newEditForm);
    console.log('CategoryId type:', typeof categoryId);
    console.log('CategoryId value:', categoryId);

    setImagePreview(safeImageUrl);
    openModal();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Check file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size should be less than 5MB');
        return;
      }

      // Create a new FileReader
      const reader = new FileReader();
      reader.onload = () => {
        // Store the file for form submission
        setSelectedImage(file);

        // Use FileReader result for preview
        const previewUrl = reader.result as string;
        setImagePreview(previewUrl);
        setEditForm({ ...editForm, imageUrl: previewUrl, image: previewUrl });
      };

      reader.onerror = () => {
        alert('Error reading file');
      };

      // Read the file
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!currentSubCategory) {
      console.error('No current subcategory selected');
      return;
    }

    try {
      setIsLoading(true);
      setEditError(null);

      const formData = new FormData();

      // Add the required fields for the update API
      formData.append('Id', currentSubCategory.id.toString());

      // Log the categoryId to verify it's correct
      console.log('Updating subcategory with categoryId:', editForm.categoryId);

      // Make sure categoryId is a number and convert to string
      const categoryIdStr = typeof editForm.categoryId === 'number' ?
        editForm.categoryId.toString() :
        editForm.categoryId || '0';

      // Add all required fields with EXACT case matching what the API expects
      formData.append('CategoryId', categoryIdStr);
      formData.append('Name', editForm.name || '');
      formData.append('Description', editForm.description || '');

      // Log the categoryId we're sending
      console.log('CategoryId being sent:', categoryIdStr, 'type:', typeof categoryIdStr);
      console.log('CategoryId parsed as number:', parseInt(categoryIdStr));

      // Handle the image URL
      // If we have a new image selected, append it
      if (selectedImage) {
        formData.append('image', selectedImage, 'subcategory-image.jpg');
        console.log('Appending new image to form data');
      }
      // If we're using an existing image URL, append it as a string
      else if (currentSubCategory.imageUrl) {
        // Just pass the relative path without the base URL
        const imageUrlPath = currentSubCategory.imageUrl;
        formData.append('ImageUrl', imageUrlPath);
        console.log('Using existing image URL:', imageUrlPath);
      }

      // Log all form data to verify
      console.log('All form data fields:');
      for (const pair of formData.entries()) {
        console.log(`- ${pair[0]}: ${pair[1]}`);
      }

      console.log('Updating subcategory with data:', {
        id: currentSubCategory.id,
        categoryId: categoryIdStr,
        name: editForm.name,
        description: editForm.description,
        hasNewImage: !!selectedImage
      });

      // Log the form data entries before sending
      console.log('FormData entries:');
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      console.log('Sending update request to API...');

      // Create a direct JSON object to send to the API
      // Make sure categoryId is a number and not a string
      const categoryIdNum = parseInt(categoryIdStr);

      if (isNaN(categoryIdNum)) {
        console.error('Invalid categoryId:', categoryIdStr);
        setEditError(`Invalid category ID: ${categoryIdStr}`);
        return;
      }

      // Log all available categories to verify the categoryId exists
      console.log('Available categories:');
      categories.forEach(cat => {
        console.log(`- ID: ${cat.id} (${typeof cat.id}), Name: ${cat.name}`);
      });

      // Check if the category exists in our local state
      const categoryExists = categories.some(cat => cat.id === categoryIdNum);
      if (!categoryExists) {
        console.warn(`Category with ID ${categoryIdNum} not found in available categories!`);

        // Try to fetch the category directly from the API to verify it exists
        try {
          console.log(`Fetching category ${categoryIdNum} directly from API...`);
          const categoryResponse = await fetch(`https://localhost:7293/api/Category/GetById?id=${categoryIdNum}`);
          const categoryData = await categoryResponse.json();

          console.log('Direct category API response:', categoryData);

          if (categoryData && categoryData.succeeded && categoryData.data) {
            console.log(`Category ${categoryIdNum} exists in the database:`, categoryData.data);
          } else {
            console.error(`Category ${categoryIdNum} not found in the database!`);
            setEditError(`Category with ID ${categoryIdNum} not found in the database. Please select a valid category.`);
            return;
          }
        } catch (error) {
          console.error('Error fetching category directly:', error);
        }
      } else {
        console.log(`Category with ID ${categoryIdNum} found in available categories.`);
      }

      // Try different formats for the update data
      // Format 1: Standard JSON with number categoryId
      const updateData = {
        id: currentSubCategory.id,
        name: editForm.name || '',
        description: editForm.description || '',
        categoryId: categoryIdNum,
        imageUrl: currentSubCategory.imageUrl || null // Include the existing imageUrl
      };

      // We're now using a more direct approach with FormData

      console.log('Direct JSON data being sent:', updateData);
      console.log('JSON string being sent:', JSON.stringify(updateData));

      // Try different approaches to find what works
      console.log('Trying multiple formats to find what works...');
      let responseData;
      let success = false;

      // Try a direct approach with the exact field names
      try {
        console.log('Trying direct approach with exact field names...');

        // Create a new FormData object with very specific field names
        const directFormData = new FormData();

        // Try all possible variations of field names
        // ID variations
        directFormData.append('id', currentSubCategory.id.toString());
        directFormData.append('Id', currentSubCategory.id.toString());
        directFormData.append('ID', currentSubCategory.id.toString());
        directFormData.append('subcategoryId', currentSubCategory.id.toString());
        directFormData.append('SubCategoryId', currentSubCategory.id.toString());

        // Name variations
        directFormData.append('name', editForm.name || '');
        directFormData.append('Name', editForm.name || '');

        // Description variations
        directFormData.append('description', editForm.description || '');
        directFormData.append('Description', editForm.description || '');

        // CategoryId variations
        directFormData.append('categoryId', categoryIdNum.toString());
        directFormData.append('CategoryId', categoryIdNum.toString());
        directFormData.append('categoryID', categoryIdNum.toString());
        directFormData.append('CategoryID', categoryIdNum.toString());
        directFormData.append('category_id', categoryIdNum.toString());

        // ImageUrl variations
        if (currentSubCategory.imageUrl) {
          directFormData.append('imageUrl', currentSubCategory.imageUrl);
          directFormData.append('ImageUrl', currentSubCategory.imageUrl);
          directFormData.append('imageURL', currentSubCategory.imageUrl);
          directFormData.append('ImageURL', currentSubCategory.imageUrl);
          directFormData.append('image_url', currentSubCategory.imageUrl);
        }

        // Image variations if selected
        if (selectedImage) {
          directFormData.append('image', selectedImage);
          directFormData.append('Image', selectedImage);
        }

        // Log the form data
        console.log('Direct FormData entries:');
        for (const pair of directFormData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        // Send the FormData with a specific URL that includes the ID
        console.log('Sending direct FormData to API...');
        const directResponse = await axios.put(
          `https://localhost:7293/api/SubCategory/Update/${currentSubCategory.id}`,
          directFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('Direct FormData response:', directResponse.data);
        if (directResponse.data && directResponse.data.succeeded) {
          responseData = directResponse.data;
          success = true;
          console.log('Direct FormData approach succeeded!');

          // Verify the update
          try {
            console.log('Verifying direct update...');
            const directVerifyResponse = await axios.get(`https://localhost:7293/api/SubCategory/GetById?id=${currentSubCategory.id}`);
            console.log('Direct verification response:', directVerifyResponse.data);

            if (directVerifyResponse.data && directVerifyResponse.data.succeeded && directVerifyResponse.data.data) {
              const updatedSubCategory = directVerifyResponse.data.data;
              console.log('Updated subcategory from direct verification:', updatedSubCategory);
              console.log('CategoryId in direct verification:', updatedSubCategory.categoryId);

              if (updatedSubCategory.categoryId !== categoryIdNum) {
                console.warn(`Direct verification shows categoryId is still ${updatedSubCategory.categoryId} instead of ${categoryIdNum}`);
              } else {
                console.log('Direct verification confirms categoryId was updated correctly!');
              }
            }
          } catch (directVerifyError) {
            console.error('Error verifying direct update:', directVerifyError);
          }
        }
      } catch (directError: unknown) {
        if (directError && typeof directError === 'object' && 'message' in directError) {
          const msg = (directError as { message?: string }).message;
          console.error('Direct FormData error:', msg);
        } else {
          console.error('Direct FormData error:', directError);
        }
        if (directError && typeof directError === 'object' && 'response' in directError) {
          const resp = (directError as { response?: { data?: unknown } }).response;
          console.error('Direct FormData error response:', resp?.data);
        }
      }

      // Try with FormData - this is what worked before for the basic update
      try {
        console.log('Trying with FormData directly...');

        // Create a new FormData object
        const formData = new FormData();

        // Add all fields with exact case matching
        formData.append('Id', currentSubCategory.id.toString());
        formData.append('Name', editForm.name || '');
        formData.append('Description', editForm.description || '');
        formData.append('CategoryId', categoryIdNum.toString());

        // Add the existing image URL if available
        if (currentSubCategory.imageUrl) {
          formData.append('ImageUrl', currentSubCategory.imageUrl);
        }

        // Add the new image if selected
        if (selectedImage) {
          formData.append('Image', selectedImage);
        }

        // Log the form data
        console.log('FormData entries:');
        for (const pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        // Send the FormData
        console.log('Sending FormData to API...');
        const formDataResponse = await axios.put('https://localhost:7293/api/SubCategory/Update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('FormData response:', formDataResponse.data);
        if (formDataResponse.data && formDataResponse.data.succeeded) {
          responseData = formDataResponse.data;
          success = true;
          console.log('FormData approach succeeded!');

          // Now try a separate API call just to update the categoryId
          try {
            console.log('Trying a separate API call just for categoryId update...');

            // Try different approaches for updating just the categoryId

            // Approach 1: JSON with just ID and categoryId
            const categoryUpdateJson = {
              id: currentSubCategory.id,
              categoryId: categoryIdNum
            };

            console.log('Sending categoryId-only JSON update:', categoryUpdateJson);
            const categoryUpdateResponse = await axios.put(
              'https://localhost:7293/api/SubCategory/UpdateCategory',
              categoryUpdateJson,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            console.log('CategoryId-only update response:', categoryUpdateResponse.data);

            // Approach 2: FormData with just ID and categoryId
            const categoryFormData = new FormData();
            categoryFormData.append('Id', currentSubCategory.id.toString());
            categoryFormData.append('CategoryId', categoryIdNum.toString());

            console.log('Sending categoryId-only FormData update');
            const categoryFormDataResponse = await axios.put(
              'https://localhost:7293/api/SubCategory/UpdateCategory',
              categoryFormData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );

            console.log('CategoryId-only FormData update response:', categoryFormDataResponse.data);
          } catch (categoryUpdateError: unknown) {
            if (categoryUpdateError && typeof categoryUpdateError === 'object' && 'message' in categoryUpdateError) {
              console.error('Error in categoryId-only update:', (categoryUpdateError as { message?: string }).message);
            } else {
              console.error('Error in categoryId-only update:', categoryUpdateError);
            }
            if (categoryUpdateError && typeof categoryUpdateError === 'object' && 'response' in categoryUpdateError) {
              const resp = (categoryUpdateError as { response?: { data?: unknown; status?: number } }).response;
              console.error('CategoryId-only update error response:', resp?.data);
              if (resp?.status === 404) {
                console.warn('The UpdateCategory endpoint might not exist. This is a backend issue.');
              }
            }
          }

          // Verify the update by fetching all subcategories and finding the one we updated
          try {
            console.log('Verifying update by fetching all subcategories...');
            const allSubCategoriesResponse = await axios.get('https://localhost:7293/api/SubCategory/GetAll');
            console.log('All subcategories response:', allSubCategoriesResponse.data);

            if (allSubCategoriesResponse.data && allSubCategoriesResponse.data.succeeded && allSubCategoriesResponse.data.data) {
              const allSubCategories = allSubCategoriesResponse.data.data;
              console.log('All subcategories:', allSubCategories);

              // Find our updated subcategory
              const updatedSubCategory = allSubCategories.find((sc: SubCategory) => sc.id === currentSubCategory.id);

              if (updatedSubCategory) {
                console.log('Found our updated subcategory:', updatedSubCategory);
                console.log('CategoryId in verification:', updatedSubCategory.categoryId);

                if (updatedSubCategory.categoryId !== categoryIdNum) {
                  console.warn(`Verification shows categoryId is still ${updatedSubCategory.categoryId} instead of ${categoryIdNum}`);
                  console.warn('This is likely a backend issue. The API is not updating the categoryId field.');

                  // Show a specific error message to the user
                  setEditError(`The subcategory was updated, but the category could not be changed. This appears to be a backend issue.`);
                } else {
                  console.log('Verification confirms categoryId was updated correctly!');
                }
              } else {
                console.error(`Could not find subcategory with ID ${currentSubCategory.id} in the response`);
              }
            }
          } catch (error: unknown) {
            if (error && typeof error === 'object' && 'message' in error) {
              console.error('Error verifying update:', (error as { message?: string }).message);
            } else {
              console.error('Error verifying update:', error);
            }
            if (error && typeof error === 'object' && 'response' in error) {
              const resp = (error as { response?: { data?: unknown } }).response;
              console.error('Verification error response:', resp?.data);
            }
          }
        }
      } catch (formDataError: unknown) {
        if (formDataError && typeof formDataError === 'object' && 'message' in formDataError) {
          console.error('FormData error:', (formDataError as { message?: string }).message);
        } else {
          console.error('FormData error:', formDataError);
        }
        if (formDataError && typeof formDataError === 'object' && 'response' in formDataError) {
          const resp = (formDataError as { response?: { data?: unknown } }).response;
          console.error('FormData error response:', resp?.data);
        }
      }

      // If previous attempts failed, try with XMLHttpRequest as a last resort
      if (!success) {
        try {
          console.log('Trying with XMLHttpRequest as a last resort...');

          // Create a new promise to handle the XMLHttpRequest
          const xmlHttpRequestPromise = new Promise<unknown>((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Create a new FormData object
            const formData = new FormData();

            // Add all fields with exact case matching
            formData.append('Id', currentSubCategory.id.toString());
            formData.append('Name', editForm.name || '');
            formData.append('Description', editForm.description || '');
            formData.append('CategoryId', categoryIdNum.toString());

            // Add the existing image URL if available
            if (currentSubCategory.imageUrl) {
              formData.append('ImageUrl', currentSubCategory.imageUrl);
            }

            // Add the new image if selected
            if (selectedImage) {
              formData.append('Image', selectedImage);
            }

            // Set up the request
            xhr.open('PUT', 'https://localhost:7293/api/SubCategory/Update');

            // Set up event handlers
            xhr.onload = function() {
              if (xhr.status === 200) {
                try {
                  const response = JSON.parse(xhr.responseText);
                  resolve(response);
                } catch (error) {
                  reject(new Error('Failed to parse response'));
                }
              } else {
                reject(new Error(`Request failed with status ${xhr.status}`));
              }
            };

            xhr.onerror = function() {
              reject(new Error('Request failed'));
            };

            // Send the request
            xhr.send(formData);
          });

          // Wait for the XMLHttpRequest to complete
          const xhrResponse = await xmlHttpRequestPromise;
          console.log('XMLHttpRequest response:', xhrResponse);

          if (xhrResponse && typeof xhrResponse === 'object' && 'succeeded' in xhrResponse) {
            if ((xhrResponse as { succeeded?: boolean }).succeeded) {
              responseData = xhrResponse;
              success = true;
              console.log('XMLHttpRequest succeeded!');

              // Verify the update by fetching all subcategories
              try {
                console.log('Verifying XMLHttpRequest update by fetching all subcategories...');
                const allSubCategoriesResponse = await axios.get('https://localhost:7293/api/SubCategory/GetAll');
                console.log('XMLHttpRequest verification response:', allSubCategoriesResponse.data);

                if (allSubCategoriesResponse.data && allSubCategoriesResponse.data.succeeded && allSubCategoriesResponse.data.data) {
                  const allSubCategories = allSubCategoriesResponse.data.data;

                  // Find our updated subcategory
                  const updatedSubCategory = allSubCategories.find((sc: SubCategory) => sc.id === currentSubCategory.id);

                  if (updatedSubCategory) {
                    console.log('Found our updated subcategory from XMLHttpRequest:', updatedSubCategory);
                    console.log('CategoryId in XMLHttpRequest verification:', updatedSubCategory.categoryId);

                    if (updatedSubCategory.categoryId !== categoryIdNum) {
                      console.warn(`XMLHttpRequest verification shows categoryId is still ${updatedSubCategory.categoryId} instead of ${categoryIdNum}`);
                    } else {
                      console.log('XMLHttpRequest verification confirms categoryId was updated correctly!');
                    }
                  } else {
                    console.error(`Could not find subcategory with ID ${currentSubCategory.id} in the XMLHttpRequest response`);
                  }
                }
              } catch (error) {
                console.error('Error verifying XMLHttpRequest update:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error with XMLHttpRequest:', error);
        }
      }

      if (!success) {
        console.error('All update attempts failed');
        setEditError('Failed to update subcategory after trying multiple formats');
        return;
      }

      console.log('Final response data:', responseData);

      // Handle image upload separately if needed
      if (selectedImage) {
        console.log('Uploading image separately...');
        const imageFormData = new FormData();
        imageFormData.append('Id', currentSubCategory.id.toString());
        imageFormData.append('image', selectedImage, 'subcategory-image.jpg');

        const imageResponse = await fetch('https://localhost:7293/api/SubCategory/UpdateImage', {
          method: 'PUT',
          body: imageFormData,
        });

        const imageResponseData = await imageResponse.json();
        console.log('Image update response:', imageResponseData);
      }

      // Check the response data structure
      if (!responseData) {
        console.error('No data in response');
        setEditError('No data in response');
        return;
      }

      if (!responseData.succeeded) {
        console.error('API returned failure:', responseData);

        // Special handling for "Category not found" error
        if (responseData.message === 'Category not found') {
          console.log('Attempting to fix "Category not found" error...');

          // Try a different approach - send the category ID as a string
          try {
            console.log('Trying with categoryId as string...');
            const stringIdUpdateData = {
              ...updateData,
              categoryId: updateData.categoryId.toString()
            };

            console.log('Sending with categoryId as string:', stringIdUpdateData);

            const stringIdResponse = await axios.put('https://localhost:7293/api/SubCategory/Update', stringIdUpdateData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('String ID response:', stringIdResponse.data);

            if (stringIdResponse.data && stringIdResponse.data.succeeded) {
              responseData = stringIdResponse.data;
              console.log('Success with categoryId as string!');
            } else {
              console.error('Still failed with categoryId as string:', stringIdResponse.data);
            }
          } catch (stringIdError) {
            console.error('Error with categoryId as string:', stringIdError);
          }
        }

        // If we still have a failure after our attempts
        if (!responseData.succeeded) {
          const errorMessage = responseData.errors ?
            responseData.errors.join(', ') :
            responseData.message || 'Failed to update subcategory';
          setEditError(errorMessage);
          return;
        }
      }

      // Success! Log the response data
      console.log('Update succeeded!');

      // Some APIs return just the ID or a simple value instead of the full object
      if (responseData.data) {
        console.log('Response data type:', typeof responseData.data);
        console.log('Response data value:', responseData.data);

        // If it's an object, we can try to access categoryId
        if (typeof responseData.data === 'object' && responseData.data !== null) {
          const updatedData = responseData.data;
          console.log('Updated data:', updatedData);

          // Check if it has categoryId property
          if ('categoryId' in updatedData) {
            console.log('CategoryId in response:', updatedData.categoryId);
          }
        }
        // If it's just a number (ID), log it
        else if (typeof responseData.data === 'number') {
          console.log('Received ID in response:', responseData.data);
        }
      }

      // Set success message
      setSuccessMessage('Subcategory updated successfully!');

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      await fetchSubCategories();
      closeModal();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const resp = (err as { response?: { data?: unknown } }).response;
        console.error('Error response:', resp?.data);
      }
      if (err && typeof err === 'object' && 'message' in err) {
        setEditError(`Failed to update subcategory: ${(err as { message?: string }).message || 'Unknown error'}`);
      } else {
        setEditError('Failed to update subcategory: Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    console.log("Deleting sub-category:", id);

    // Clear any previous error
    setDeleteError(null);

    // Set the subcategory ID to delete and open the confirmation modal
    setSubCategoryToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (!subCategoryToDelete) {
      console.error('No subcategory selected for deletion');
      return;
    }

    try {
      setIsDeleting(true);
      console.log(`Deleting subcategory with ID: ${subCategoryToDelete}`);

      const response = await subCategoryService.deleteSubCategory(subCategoryToDelete);
      console.log('Delete response:', response.data);

      if (response.data && response.data.succeeded) {
        // Set success message
        setSuccessMessage('Subcategory deleted successfully!');

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        await fetchSubCategories();
        closeDeleteModal();
        setSubCategoryToDelete(null);
      } else {
        // Show error message
        console.error('API returned failure:', response.data);
        const errorMessage = response.data && response.data.errors ?
          response.data.errors.join(', ') :
          (response.data && response.data.message) ?
            response.data.message :
            'Failed to delete subcategory';
        setDeleteError(errorMessage);
      }
    } catch (err: unknown) {
      console.error('Error deleting subcategory:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const resp = (err as { response?: { data?: unknown } }).response;
        console.error('Error response:', resp?.data);
      }
      if (err && typeof err === 'object' && 'message' in err) {
        setDeleteError(`Failed to delete subcategory: ${(err as { message?: string }).message || 'Unknown error'}`);
      } else {
        setDeleteError('Failed to delete subcategory: Unknown error');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Success Toast Notification */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
            <span className="sr-only">Success icon</span>
          </div>
          <div className="ml-3 text-sm font-medium">{successMessage}</div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
      )}
      <ComponentCard title="Product Sub-Categories">
        <Form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Category Select */}
                <div>
                  <Label htmlFor="category">Select Category</Label>
                  {isLoading ? (
                    <div className="py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      Loading categories...
                    </div>
                  ) : (
                    <Select
                      options={categoryOptions}
                      placeholder="Select parent category"
                      value={selectedCategoryId ? selectedCategoryId.toString() : ""}
                      onChange={(value) => {
                        const categoryId = parseInt(value);
                        setSelectedCategoryId(categoryId);
                        // In a real app, we would store the category name
                        // const category = categories.find(cat => cat.id === categoryId);
                        // if (category) {
                        //   // Use category name for display or API calls
                        // }
                      }}
                    />
                  )}
                  {deleteError && (
                    <p className="mt-1 text-sm text-red-500">{deleteError}</p>
                  )}
                </div>

                {/* Sub-Category Input */}
                <div>
                  <Label htmlFor="subCategory">Sub-Category Name</Label>
                  <Input
                    type="text"
                    id="subCategory"
                    placeholder="Enter sub-category name"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                  />
                </div>

                {/* Sub-Category Description */}
                <div>
                  <Label htmlFor="description">Sub-Category Description</Label>
                  <TextArea
                    id="description"
                    placeholder="Enter sub-category description"
                    value={description}
                    onChange={(value) => setDescription(value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Right Column - Dropzone */}
              <div>
                <Label>Sub-Category Image</Label>
                <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
                  <div
                    {...getRootProps()}
                    className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
                      ${isDragActive
                        ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                        : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                      }`}
                  >
                    <input {...getInputProps()} />
                    {/* Show preview if available */}
                    {subCategoryImagePreview ? (
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 mb-4">
                          <Image
                            src={subCategoryImagePreview}
                            alt="Sub-category preview"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click or drag to replace image
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                          <svg
                            className="w-6 h-6 text-gray-700 dark:text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Drag & drop sub-category image here or click to select
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-start">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-colors duration-150 bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                Add Sub-Category
              </button>
            </div>

            {/* Sub-Categories List */}
            {subCategories.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Sub-Categories List
                </h3>
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Image
                          </th>
                          <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Sub-Category
                          </th>
                          <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {subCategories.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]">
                            <td className="px-5 py-4 sm:px-6 text-start">
                              {item.imageUrl && (
                                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                  <Image
                                    width={40}
                                    height={40}
                                    src={`https://localhost:7293/${item.imageUrl}`}
                                    alt={item.name}
                                    priority={true}
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-4 sm:px-6 text-start">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">{item.categoryName}</span>
                            </td>
                            <td className="px-5 py-4 sm:px-6 text-start">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">{item.name}</span>
                            </td>
                            <td className="px-5 py-4 sm:px-6 text-start text-gray-700 text-theme-sm dark:text-gray-300">
                              {item.description}
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="inline-flex items-center justify-center p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-500/10"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="inline-flex items-center justify-center p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-500/10"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Form>
      </ComponentCard>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        className="max-w-[450px] p-6"
      >
        <div className="text-center">
          <div className="relative flex items-center justify-center z-1 mb-5">
            <svg
              className="fill-error-50 dark:fill-error-500/15"
              width="80"
              height="80"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M45 0C20.1827 0 0 20.1827 0 45C0 69.8173 20.1827 90 45 90C69.8173 90 90 69.8174 90 45C90.0056 44.6025 90.0056 44.2049 90 43.8074C89.3817 19.4558 69.3842 0.0028 45 0Z"
                fill="inherit"
              />
            </svg>
            <div className="absolute flex items-center justify-center w-[62px] h-[62px] rounded-full border-[6px] border-white dark:border-gray-900 bg-error-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </div>
          </div>

          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            Delete Subcategory
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this subcategory? This action cannot be undone.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                closeDeleteModal();
                setDeleteError(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-error-500 hover:bg-error-600 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>

          {deleteError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg dark:bg-red-900/20 dark:text-red-400">
              {deleteError}
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-5 lg:p-6">
        <div className="mb-5">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Edit Sub-Category
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update sub-category details
          </p>
        </div>

        <form className="space-y-4">
          {/* Sub-Category Image */}
          <div>
            <Label>Sub-Category Image</Label>
            <div className="mt-2 flex flex-col items-center justify-center gap-3">
              <div className="relative h-32 w-32">
                <Image
                  src={imagePreview || "/images/product/product-default.png"}
                  alt={editForm.name || 'Subcategory image'}
                  fill
                  className="object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
              </div>
              <label className="cursor-pointer px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-300">Change Image</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <Label>Category</Label>
              {isLoading ? (
                <div className="py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  Loading categories...
                </div>
              ) : (
                <EditCategorySelect
                  options={categoryOptions}
                  initialValue={editForm.categoryId}
                  onChange={(value) => {
                    try {
                      const categoryId = parseInt(value);
                      if (isNaN(categoryId)) {
                        console.error('Invalid category ID:', value);
                        return;
                      }

                      // Find the category name
                      const category = categories.find(cat => cat.id === categoryId);
                      if (!category) {
                        console.warn('Category not found for ID:', categoryId);
                      }

                      // Log before update
                      console.log('Before update - editForm:', { ...editForm });
                      console.log('Selected categoryId:', categoryId, 'type:', typeof categoryId);
                      console.log('Found category:', category);

                      // Update the form with the new categoryId
                      const updatedForm = {
                        ...editForm,
                        categoryId: categoryId,
                        categoryName: category ? category.name : "Unknown Category"
                      };

                      setEditForm(updatedForm);

                      // Log after update
                      console.log('After update - editForm should be:', updatedForm);
                      console.log('Updated category ID to:', categoryId, 'type:', typeof categoryId);
                    } catch (error) {
                      console.error('Error updating category:', error);
                    }
                  }}
                  placeholder="Select category"
                  className="w-full"
                />
              )}
            </div>

            <div>
              <Label>Sub-Category Name</Label>
              <Input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({...editForm, name: e.target.value, subCategory: e.target.value})}
                className="w-full"
              />
            </div>

            <div>
              <Label>Description</Label>
              <TextArea
                value={editForm.description}
                onChange={(value) => setEditForm({...editForm, description: value})}
                rows={4}
                className="w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => {
                closeModal();
                setEditError(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : 'Update'}
            </Button>
          </div>

          {editError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg dark:bg-red-900/20 dark:text-red-400">
              {editError}
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}






