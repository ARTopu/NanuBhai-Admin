"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import Radio from "../form/input/Radio";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";

// Define interface for category
interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

export default function AddProduct() {
  const [stockStatus, setStockStatus] = useState<string>("inStock");
  const [freeDelivery, setFreeDelivery] = useState<string>("no");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);

  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoryError(null);

      try {
        const response = await categoryService.getCategories();
        console.log('Categories API Response:', response.data);

        // Check if the response has the expected structure
        if (response.data && response.data.succeeded && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error('Unexpected API response format:', response.data);
          setCategoryError('Failed to load categories: Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setProductImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  // Remove image handler
  const removeImage = (indexToRemove: number) => {
    setProductImages(productImages.filter((_, index) => index !== indexToRemove));
  };

  // Convert categories from API to the format expected by the Select component
  const categoryOptions = categories.map(category => ({
    value: category.id.toString(),
    label: category.name
  }));

  // Create a dynamic object for subcategories based on category IDs
  // This is a placeholder - in a real app, you would fetch subcategories from the API
  const subCategoryOptions: Record<string, Array<{value: string, label: string}>> = {};

  // Initialize subcategories for each category
  categories.forEach(category => {
    // For now, we'll use placeholder subcategories
    // In a real app, you would fetch these from the API based on the selected category
    subCategoryOptions[category.id.toString()] = [
      { value: "sub1", label: `${category.name} - Subcategory 1` },
      { value: "sub2", label: `${category.name} - Subcategory 2` },
      { value: "sub3", label: `${category.name} - Subcategory 3` },
    ];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Form submit event triggered");
    e.preventDefault();

    try {
      // Get form elements
      const form = e.target as HTMLFormElement;
      console.log("Form element:", form);

      const productNameInput = form.querySelector('#productName') as HTMLInputElement;
      const priceInput = form.querySelector('#price') as HTMLInputElement;
      const quantityInput = form.querySelector('#quantity') as HTMLInputElement;

      console.log("Form inputs:", {
        productName: productNameInput?.value,
        price: priceInput?.value,
        quantity: quantityInput?.value
      });

      // Create FormData for the API request
      const formData = new FormData();

      // Add basic product information
      formData.append('name', productNameInput?.value || '');
      formData.append('description', description);
      formData.append('price', priceInput?.value || '0');
      const previousPriceInput = form.querySelector('#previousPrice') as HTMLInputElement | null;
      formData.append('previousPrice', previousPriceInput?.value || '0');
      formData.append('quantity', quantityInput?.value || '0');
      formData.append('stockStatus', stockStatus);
      formData.append('freeDelivery', freeDelivery);

      // Add category information
      if (selectedCategory) {
        formData.append('categoryId', selectedCategory);

        // Get the category name for reference
        const categoryName = categories.find(cat => cat.id.toString() === selectedCategory)?.name || '';
        console.log(`Using category: ${categoryName} (ID: ${selectedCategory})`);
      }

      // Add product images
      if (productImages.length > 0) {
        console.log(`Adding ${productImages.length} images to the form data`);

        // Convert base64 images to files
        for (let i = 0; i < productImages.length; i++) {
          try {
            const imageUrl = productImages[i];
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            formData.append('images', blob, `product-image-${i}.jpg`);
          } catch (imageError) {
            console.error(`Error processing image ${i}:`, imageError);
          }
        }
      }

      console.log("Form data prepared, sending to API...");

      // Show loading state (in a real app, you would use a state variable)
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Adding Product...';
      }

      // Send the data to the API
      try {
        const response = await productService.createProduct(formData);

        if (response.data && response.data.succeeded) {
          console.log("Product created successfully:", response.data);
          alert("Product added successfully!");

          // Reset form (in a real app, you would use a more elegant approach)
          form.reset();
          setDescription('');
          setSelectedCategory('');
          setStockStatus('inStock');
          setFreeDelivery('no');
          setProductImages([]);
        } else {
          console.error("API returned error:", response.data);
          alert(`Failed to add product: ${response.data.message || 'Unknown error'}`);
        }
      } catch (apiError: unknown) {
        if (
          apiError &&
          typeof apiError === 'object' &&
          'message' in apiError &&
          typeof (apiError as { message?: unknown }).message === 'string'
        ) {
          alert(`Error adding product: ${(apiError as { message: string }).message || 'Unknown error'}`);
        } else {
          alert('Error adding product: Unknown error');
        }
        console.error("API call failed:", apiError);
      } finally {
        // Reset button state
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Add Product';
        }
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      alert(`An unexpected error occurred: ${error}`);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);

    // Find the selected category object
    const selectedCategoryObj = categories.find(cat => cat.id.toString() === value);

    console.log("Selected category:", value);
    console.log("Selected category name:", selectedCategoryObj?.name);
  };

  return (
    <ComponentCard title="Add New Product">
      <Form onSubmit={handleSubmit} className="w-full">
        <div className="grid gap-6">
          {/* Dropzone for Images */}
          <div className="col-span-full">
            <Label>Product Media</Label>
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
                <div className="flex flex-col items-center">
                  {productImages.length > 0 ? (
                    <div className="w-full">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {productImages.map((image, index) => (
                          <div key={index} className="relative w-full h-32">
                            <Image
                              src={image}
                              alt={`Product ${index + 1}`}
                              fill
                              className="object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                        Drop more images or click to add
                      </p>
                    </div>
                  ) : (
                    <>
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
                      <p className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                        {isDragActive ? "Drop files here" : "Drag & Drop product images"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Supports: Images (PNG, JPG, WebP)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  type="text"
                  id="productName"
                  placeholder="Enter product name"
                />
              </div>

              {/* Product Category */}
              <div>
                <Label htmlFor="category">Product Category</Label>
                {isLoadingCategories ? (
                  <div className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 flex items-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                    Loading categories...
                  </div>
                ) : categoryError ? (
                  <div>
                    <div className="h-11 w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 flex items-center text-sm text-red-500 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
                      Failed to load categories
                    </div>
                    <p className="mt-1 text-xs text-red-500">{categoryError}</p>
                  </div>
                ) : (
                  <Select
                    options={categoryOptions}
                    placeholder={categoryOptions.length > 0 ? "Select product category" : "No categories available"}
                    onChange={handleCategoryChange}
                    value={selectedCategory}
                  />
                )}
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  placeholder="Enter product price"
                  min="0"
                  step={0.01}
                />
              </div>

              {/* Previous Price */}
              <div>
                <Label htmlFor="previousPrice">Previous Price</Label>
                <Input
                  type="number"
                  id="previousPrice"
                  placeholder="Enter previous price (if any)"
                  min="0"
                  step={0.01}
                />
              </div>

              {/* Stock Status */}
              <div>
                <Label>Stock Status</Label>
                <div className="flex gap-6">
                  <Radio
                    id="inStock"
                    label="In Stock"
                    name="stockStatus"
                    value="inStock"
                    checked={stockStatus === "inStock"}
                    onChange={() => setStockStatus("inStock")}
                  />
                  <Radio
                    id="outOfStock"
                    label="Out of Stock"
                    name="stockStatus"
                    value="outOfStock"
                    checked={stockStatus === "outOfStock"}
                    onChange={() => setStockStatus("outOfStock")}
                  />
                </div>
              </div>

              {/* Free Delivery */}
              <div>
                <Label>Free Delivery</Label>
                <div className="flex gap-6">
                  <Radio
                    id="freeDeliveryYes"
                    label="Yes"
                    name="freeDelivery"
                    value="yes"
                    checked={freeDelivery === "yes"}
                    onChange={() => setFreeDelivery("yes")}
                  />
                  <Radio
                    id="freeDeliveryNo"
                    label="No"
                    name="freeDelivery"
                    value="no"
                    checked={freeDelivery === "no"}
                    onChange={() => setFreeDelivery("no")}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Product Description */}
              <div>
                <Label htmlFor="description">Product Description</Label>
                <TextArea
                  id="description"
                  placeholder="Enter detailed product description"
                  rows={4}
                  value={description}
                  onChange={(value) => setDescription(value)}
                />
              </div>

              {/* Quantity */}
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  type="number"
                  id="quantity"
                  placeholder="Enter product quantity"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-colors duration-150 bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              Add Product
            </button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}
