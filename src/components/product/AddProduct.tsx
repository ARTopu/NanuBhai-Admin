  "use client";
import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import Radio from "../form/input/Radio";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

export default function AddProduct() {
  const [stockStatus, setStockStatus] = useState<string>("inStock");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [information, setInformation] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);

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

  const categoryOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "books", label: "Books" },
    { value: "furniture", label: "Furniture" },
    { value: "sports", label: "Sports" },
  ];

  const subCategoryOptions = {
    electronics: [
      { value: "smartphones", label: "Smartphones" },
      { value: "laptops", label: "Laptops" },
      { value: "accessories", label: "Accessories" },
    ],
    clothing: [
      { value: "mens", label: "Men's Wear" },
      { value: "womens", label: "Women's Wear" },
      { value: "kids", label: "Kids Wear" },
    ],
    books: [
      { value: "fiction", label: "Fiction" },
      { value: "non-fiction", label: "Non-Fiction" },
      { value: "educational", label: "Educational" },
    ],
    furniture: [
      { value: "living-room", label: "Living Room" },
      { value: "bedroom", label: "Bedroom" },
      { value: "office", label: "Office" },
    ],
    sports: [
      { value: "equipment", label: "Equipment" },
      { value: "clothing", label: "Clothing" },
      { value: "accessories", label: "Accessories" },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    console.log("Selected category:", value);
  };

  const handleSubCategoryChange = (value: string) => {
    console.log("Selected sub-category:", value);
  };

  return (
    <ComponentCard title="Add New Product">
      <Form onSubmit={handleSubmit}>
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
                <Select
                  options={categoryOptions}
                  placeholder="Select product category"
                  onChange={handleCategoryChange}
                />
              </div>

              {/* Sub Category */}
              <div>
                <Label htmlFor="subCategory">Product Sub-Category</Label>
                <Select
                  options={selectedCategory ? subCategoryOptions[selectedCategory as keyof typeof subCategoryOptions] : []}
                  placeholder={selectedCategory ? "Select sub-category" : "Please select a category first"}
                  onChange={handleSubCategoryChange}
                  className={!selectedCategory ? "opacity-50 cursor-not-allowed" : ""}
                />
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

              {/* Product Info */}
              <div>
                <Label htmlFor="info">Product Information</Label>
                <TextArea
                  id="info"
                  placeholder="Enter additional product information, specifications, etc."
                  rows={4}
                  value={information}
                  onChange={(value) => setInformation(value)}
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
