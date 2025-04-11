"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import { useDropzone } from "react-dropzone";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { categoryService } from '@/services/categoryService';

const DEFAULT_IMAGE = "/images/product/product-default.png";

interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  subCategories: any[];
}

interface EditFormState {
  name: string;
  description: string;
  imageUrl: string;
}

export default function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    description: "",
    imageUrl: DEFAULT_IMAGE
  });
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      console.log('API Response:', response.data);

      // Check if the response has the expected structure
      if (response.data && response.data.succeeded && Array.isArray(response.data.data)) {
        // Use the data array from the API response
        const categoriesData = response.data.data;
        console.log('Categories data:', categoriesData);

        // Process the categories to handle image paths
        const processedCategories = categoriesData.map((cat: Category) => {
          // If imageUrl is null or undefined, use default image for display purposes
          // We'll keep the original null value in the data
          return {
            ...cat,
            // We don't modify the actual imageUrl property here, just for display purposes
          };
        });

        setCategories(processedCategories);
      } else {
        console.error('Unexpected API response format:', response.data);
        console.error('Failed to fetch categories: Unexpected response format');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      console.error('Failed to fetch categories');
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCategoryImage(result);
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
    setFormError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', category.trim());
      formData.append('description', description.trim());

      if (categoryImage) {
        const base64Response = await fetch(categoryImage);
        const blob = await base64Response.blob();
        formData.append('image', blob, 'category-image.jpg');
      }

      await categoryService.createCategory(formData);

      // Set success message
      setSuccessMessage('Category created successfully!');

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      await fetchCategories();

      setCategory("");
      setDescription("");
      setCategoryImage(null);
      (e.target as HTMLFormElement).reset();

    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create category');
      console.error('Error creating category:', err);
    } finally {
      setIsLoading(false);
    }
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
        setSelectedImage(file);
        // Use FileReader result for preview
        const previewUrl = reader.result as string;
        setImagePreview(previewUrl);
        setEditForm({ ...editForm, imageUrl: previewUrl });
      };

      reader.onerror = () => {
        alert('Error reading file');
      };

      // Read the file
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (category: Category) => {
    // Clear any previous error
    setEditError(null);

    setCurrentCategory(category);

    // Process the image URL to ensure it's a string
    let safeImageUrl = DEFAULT_IMAGE;

    if (category.imageUrl) {
      // If we have an image URL from the API, use it with the base URL
      safeImageUrl = `https://localhost:7293/${category.imageUrl}`;
    }

    console.log('Editing category with image:', safeImageUrl);

    setEditForm({
      name: category.name,
      description: category.description || '',
      imageUrl: safeImageUrl
    });
    setImagePreview(safeImageUrl);
    openModal();
  };

  const handleUpdate = async () => {
    if (!currentCategory) {
      console.error('No current category selected');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();

      // Add the required fields for the update API
      formData.append('Id', currentCategory.id.toString());
      formData.append('Name', editForm.name);
      formData.append('Description', editForm.description || '');

      // Append image if a new image was selected
      if (selectedImage) {
        formData.append('ImageFile', selectedImage, 'category-image.jpg');
      }

      console.log('Updating category with data:', {
        id: currentCategory.id,
        name: editForm.name,
        description: editForm.description,
        hasNewImage: !!selectedImage
      });

      const response = await categoryService.updateCategory(currentCategory.id, formData);
      console.log('Update response:', response);

      if (response.data && response.data.succeeded) {
        // Set success message
        setSuccessMessage('Category updated successfully!');

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        // Update the categories list
        await fetchCategories();

        // Reset states
        setSelectedImage(null);
        setImagePreview('');
        closeModal();
      } else {
        // Show error message
        console.error('API returned failure:', response.data);
        const errorMessage = response.data && response.data.errors ?
          response.data.errors.join(', ') :
          (response.data && response.data.message) ?
            response.data.message :
            'Failed to update category';
        setEditError(errorMessage);
      }
    } catch (error: any) {
      console.error('API call failed:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      setEditError(`Failed to update category: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (categoryId: number) => {
    // Clear any previous error
    setDeleteError(null);

    // Set the category ID to delete and open the confirmation modal
    setCategoryToDelete(categoryId);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) {
      console.error('No category selected for deletion');
      return;
    }

    try {
      setIsDeleting(true);
      console.log(`Deleting category with ID: ${categoryToDelete}`);

      const response = await categoryService.deleteCategory(categoryToDelete);
      console.log('Delete response:', response.data);

      if (response.data && response.data.succeeded) {
        // Set success message
        setSuccessMessage('Category deleted successfully!');

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        await fetchCategories();
        closeDeleteModal();
        setCategoryToDelete(null);
      } else {
        // Show error message
        console.error('API returned failure:', response.data);
        const errorMessage = response.data && response.data.errors ?
          response.data.errors.join(', ') :
          (response.data && response.data.message) ?
            response.data.message :
            'Failed to delete category';
        setDeleteError(errorMessage);
      }
    } catch (err: any) {
      console.error('Error deleting category:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
      }
      setDeleteError(`Failed to delete category: ${err.message || 'Unknown error'}`);
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
            Delete Category
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this category? This action cannot be undone.
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

      <ComponentCard title="Product Categories">
        <Form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="category">Category Name</Label>
                  <Input
                    type="text"
                    id="category"
                    placeholder="Enter category name"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Category Description</Label>
                  <TextArea
                    id="description"
                    placeholder="Enter category description"
                    value={description}
                    onChange={setDescription}
                    rows={4}
                  />
                </div>
              </div>

              {/* Right Column - Dropzone */}
              <div>
                <Label>Category Image</Label>
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
                    {categoryImage ? (
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 mb-4">
                          <Image
                            src={categoryImage || ''}
                            alt="Category preview"
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
                          Drag & drop category image here or click to select
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <button
                type="submit"
                disabled={isLoading}
                className={`inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-colors duration-150 bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Category'
                )}
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{formError}</p>
              </div>
            )}
          </div>
        </Form>

        {/* Categories Table */}
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-16 h-16">
                        <Image
                          src={category.imageUrl ? `https://localhost:7293/${category.imageUrl}` : DEFAULT_IMAGE}
                          alt={category.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                    <td className="px-6 py-4">{category.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
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
                          onClick={() => handleDelete(category.id)}
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
      </ComponentCard>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-5 lg:p-6">
        <div className="mb-5">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Edit Category
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update category details
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <Label>Category Name</Label>
            <Input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
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

          {/* Category Image */}
          <div>
            <Label>Category Image</Label>
            <div className="mt-2 flex flex-col items-center justify-center gap-3">
              <img
                src={imagePreview || editForm.imageUrl}
                alt={editForm.name}
                className="h-32 w-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
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

          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={() => {
              closeModal();
              setEditError(null);
            }} variant="outline" disabled={isLoading}>Cancel</Button>
            <Button onClick={handleUpdate} variant="primary" disabled={isLoading}>
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




