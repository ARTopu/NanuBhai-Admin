"use client";
import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Select from "../form/Select";
import { useDropzone } from "react-dropzone";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Image from "next/image";

interface SubCategory {
  id: number;
  image?: string;
  category: string;
  subCategory: string;
  description: string;
}

interface EditFormState {
  category: string;
  subCategory: string;
  description: string;
  image: string | null;
}

export default function SubCategories() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [subCategoryImage, setSubCategoryImage] = useState<string | null>(null);
  const [currentSubCategory, setCurrentSubCategory] = useState<any>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    category: "",
    subCategory: "",
    description: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState("");
  const { isOpen, openModal, closeModal } = useModal();

  // Sample categories - replace with your actual categories from API/state
  const categoryOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "books", label: "Books" },
    { value: "furniture", label: "Furniture" },
    { value: "sports", label: "Sports" },
  ];

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSubCategoryImage(reader.result as string);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (selectedCategory && subCategory.trim()) {
      setSubCategories([...subCategories, {
        id: subCategories.length + 1,
        category: selectedCategory,
        subCategory: subCategory.trim(),
        description: description.trim(),
        image: subCategoryImage || undefined
      }]);

      // Reset all form fields
      setSelectedCategory("");
      setSubCategory("");
      setDescription("");
      setSubCategoryImage(null);
      form.reset(); // Reset the native form
    }
  };

  const handleEdit = (subCategory: any) => {
    setCurrentSubCategory(subCategory);
    setEditForm({
      category: subCategory.category,
      subCategory: subCategory.subCategory,
      description: subCategory.description,
      image: subCategory.image
    });
    setImagePreview(subCategory.image || "");
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
        // Use FileReader result for preview
        const previewUrl = reader.result as string;
        setImagePreview(previewUrl);
        setEditForm({ ...editForm, image: previewUrl });
      };

      reader.onerror = () => {
        alert('Error reading file');
      };

      // Read the file
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Create form data if there's a new image
      const formData = new FormData();
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      // Add other form data
      formData.append('category', editForm.category);
      formData.append('subCategory', editForm.subCategory);
      formData.append('description', editForm.description);

      // Handle save logic here
      console.log("Saving changes...", editForm);

      closeModal();
    } catch (error) {
      console.error("Error saving sub-category:", error);
    }
  };

  const handleDelete = (id: number) => {
    console.log("Deleting sub-category:", id);
    // Add your delete logic here
  };

  return (
    <>
      <ComponentCard title="Product Sub-Categories">
        <Form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Category Select */}
                <div>
                  <Label htmlFor="category">Select Category</Label>
                  <Select
                    options={categoryOptions}
                    placeholder="Select parent category"
                    value={selectedCategory}
                    onChange={(value) => setSelectedCategory(value)}
                  />
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
                    {subCategoryImage ? (
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 mb-4">
                          <Image
                            src={subCategoryImage}
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Image
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Sub-Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {subCategories.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.image && (
                                <div className="relative h-10 w-10">
                                  <Image
                                    src={item.image}
                                    alt={item.subCategory}
                                    fill
                                    className="rounded-full object-cover"
                                  />
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {item.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {item.subCategory}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {item.description}
                              </div>
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
                  alt={editForm.subCategory}
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
              <Select
                options={categoryOptions}
                value={editForm.category}
                onChange={(value) => setEditForm({...editForm, category: value})}
                placeholder="Select category"
                className="w-full"
              />
            </div>

            <div>
              <Label>Sub-Category Name</Label>
              <Input
                type="text"
                value={editForm.subCategory}
                onChange={(e) => setEditForm({...editForm, subCategory: e.target.value})}
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
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}






