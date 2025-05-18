"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import Pagination from "../tables/Pagination";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";

interface Product {
  id: number;
  product: {
    image: string;
    name: string;
    productId: string;
  };
  category: string;
  price: string;
  stock: number;
}

interface EditFormState {
  name: string;
  productId: string;
  category: string;
  price: string;
  stock: number;
  image: string;
}

const categoryOptions = [
  { value: "Storage", label: "Storage" },
  { value: "Measuring Tools", label: "Measuring Tools" },
  { value: "Decorating Tools", label: "Decorating Tools" },
  { value: "Display", label: "Display" },
  { value: "Baking Tools", label: "Baking Tools" },
  { value: "Appliances", label: "Appliances" },
  { value: "Baking Molds", label: "Baking Molds" },
];

const tableData: Product[] = [
  // Page 1 (1-15)
  {
    id: 1,
    product: {
      image: "/images/product/product-default.png",
      name: "Professional Cake Mold Set",
      productId: "BKG-1001",
    },
    category: "Baking Molds",
    price: "$49.99",
    stock: 0,  // Changed to 0 for out of stock
  },
  {
    id: 2,
    product: {
      image: "/images/product/product-default.png",
      name: "Silicone Baking Mat",
      productId: "BKG-1002",
    },
    category: "Baking Tools",
    price: "$19.99",
    stock: 42,
  },
  {
    id: 3,
    product: {
      image: "/images/product/product-default.png",
      name: "Pastry Piping Set",
      productId: "BKG-1003",
    },
    category: "Decorating Tools",
    price: "$34.99",
    stock: 0,  // Changed to 0 for out of stock
  },
  {
    id: 4,
    product: {
      image: "/images/product/product-default.png",
      name: "Digital Kitchen Scale",
      productId: "BKG-1004",
    },
    category: "Measuring Tools",
    price: "$29.99",
    stock: 30,
  },
  {
    id: 5,
    product: {
      image: "/images/product/product-default.png",
      name: "Stand Mixer",
      productId: "BKG-1005",
    },
    category: "Appliances",
    price: "$299.99",
    stock: 0,  // Changed to 0 for out of stock
  },
  {
    id: 6,
    product: {
      image: "/images/product/product-default.png",
      name: "Cookie Cutter Set",
      productId: "BKG-1006",
    },
    category: "Baking Tools",
    price: "$15.99",
    stock: 50,
  },
  {
    id: 7,
    product: {
      image: "/images/product/product-default.png",
      name: "Cake Turntable",
      productId: "BKG-1007",
    },
    category: "Decorating Tools",
    price: "$24.99",
    stock: 20,
  },
  {
    id: 8,
    product: {
      image: "/images/product/product-default.png",
      name: "Bread Loaf Pan",
      productId: "BKG-1008",
    },
    category: "Baking Molds",
    price: "$16.99",
    stock: 35,
  },
  {
    id: 9,
    product: {
      image: "/images/product/product-default.png",
      name: "Measuring Cups Set",
      productId: "BKG-1009",
    },
    category: "Measuring Tools",
    price: "$19.99",
    stock: 40,
  },
  {
    id: 10,
    product: {
      image: "/images/product/product-default.png",
      name: "Rolling Pin",
      productId: "BKG-1010",
    },
    category: "Baking Tools",
    price: "$12.99",
    stock: 45,
  },
  {
    id: 11,
    product: {
      image: "/images/product/product-default.png",
      name: "Cake Decorating Kit",
      productId: "BKG-1011",
    },
    category: "Decorating Tools",
    price: "$39.99",
    stock: 15,
  },
  {
    id: 12,
    product: {
      image: "/images/product/product-default.png",
      name: "Muffin Pan",
      productId: "BKG-1012",
    },
    category: "Baking Molds",
    price: "$22.99",
    stock: 25,
  },
  {
    id: 13,
    product: {
      image: "/images/product/product-default.png",
      name: "Hand Mixer",
      productId: "BKG-1013",
    },
    category: "Appliances",
    price: "$49.99",
    stock: 12,
  },
  {
    id: 14,
    product: {
      image: "/images/product/product-default.png",
      name: "Cooling Rack",
      productId: "BKG-1014",
    },
    category: "Baking Tools",
    price: "$14.99",
    stock: 30,
  },
  {
    id: 15,
    product: {
      image: "/images/product/product-default.png",
      name: "Fondant Tools Set",
      productId: "BKG-1015",
    },
    category: "Decorating Tools",
    price: "$29.99",
    stock: 20,
  },

  // Page 2 (16-30)
  {
    id: 16,
    product: {
      image: "/images/product/product-default.png",
      name: "Silicone Spatula Set",
      productId: "BKG-1016",
    },
    category: "Baking Tools",
    price: "$18.99",
    stock: 28,
  },
  {
    id: 17,
    product: {
      image: "/images/product/product-default.png",
      name: "Bundt Cake Pan",
      productId: "BKG-1017",
    },
    category: "Baking Molds",
    price: "$27.99",
    stock: 15,
  },
  {
    id: 18,
    product: {
      image: "/images/product/product-default.png",
      name: "Food Processor",
      productId: "BKG-1018",
    },
    category: "Appliances",
    price: "$199.99",
    stock: 10,
  },
  {
    id: 19,
    product: {
      image: "/images/product/product-default.png",
      name: "Decorating Tips Set",
      productId: "BKG-1019",
    },
    category: "Decorating Tools",
    price: "$32.99",
    stock: 22,
  },
  {
    id: 20,
    product: {
      image: "/images/product/product-default.png",
      name: "Digital Timer",
      productId: "BKG-1020",
    },
    category: "Measuring Tools",
    price: "$14.99",
    stock: 35,
  },
  {
    id: 21,
    product: {
      image: "/images/product/product-default.png",
      name: "Springform Pan",
      productId: "BKG-1021",
    },
    category: "Baking Molds",
    price: "$23.99",
    stock: 18,
  },
  {
    id: 22,
    product: {
      image: "/images/product/product-default.png",
      name: "Pastry Brush Set",
      productId: "BKG-1022",
    },
    category: "Baking Tools",
    price: "$12.99",
    stock: 40,
  },
  {
    id: 23,
    product: {
      image: "/images/product/product-default.png",
      name: "Cake Leveler",
      productId: "BKG-1023",
    },
    category: "Decorating Tools",
    price: "$16.99",
    stock: 25,
  },
  {
    id: 24,
    product: {
      image: "/images/product/product-default.png",
      name: "Mixing Bowls Set",
      productId: "BKG-1024",
    },
    category: "Baking Tools",
    price: "$34.99",
    stock: 30,
  },
  {
    id: 25,
    product: {
      image: "/images/product/product-default.png",
      name: "Icing Smoother",
      productId: "BKG-1025",
    },
    category: "Decorating Tools",
    price: "$9.99",
    stock: 45,
  },
  {
    id: 26,
    product: {
      image: "/images/product/product-default.png",
      name: "Cookie Sheet Set",
      productId: "BKG-1026",
    },
    category: "Baking Tools",
    price: "$28.99",
    stock: 20,
  },
  {
    id: 27,
    product: {
      image: "/images/product/product-default.png",
      name: "Fondant Rolling Pin",
      productId: "BKG-1027",
    },
    category: "Decorating Tools",
    price: "$19.99",
    stock: 15,
  },
  {
    id: 28,
    product: {
      image: "/images/product/product-default.png",
      name: "Cake Carrier",
      productId: "BKG-1028",
    },
    category: "Storage",
    price: "$39.99",
    stock: 12,
  },
  {
    id: 29,
    product: {
      image: "/images/product/product-default.png",
      name: "Measuring Spoons",
      productId: "BKG-1029",
    },
    category: "Measuring Tools",
    price: "$8.99",
    stock: 50,
  },
  {
    id: 30,
    product: {
      image: "/images/product/product-default.png",
      name: "Piping Bags Set",
      productId: "BKG-1030",
    },
    category: "Decorating Tools",
    price: "$15.99",
    stock: 35,
  },

  // Page 3 (31-45)
  {
    id: 31,
    product: {
      image: "/images/product/product-default.png",
      name: "Cake Stand",
      productId: "BKG-1031",
    },
    category: "Display",
    price: "$45.99",
    stock: 15,
  },
  {
    id: 32,
    product: {
      image: "/images/product/product-default.png",
      name: "Cookie Stamps Set",
      productId: "BKG-1032",
    },
    category: "Baking Tools",
    price: "$24.99",
    stock: 20,
  },
  {
    id: 33,
    product: {
      image: "/images/product/product-default.png",
      name: "Cupcake Carrier",
      productId: "BKG-1033",
    },
    category: "Storage",
    price: "$29.99",
    stock: 18,
  },
  {
    id: 34,
    product: {
      image: "/images/product/product-default.png",
      name: "Dough Scraper",
      productId: "BKG-1034",
    },
    category: "Baking Tools",
    price: "$7.99",
    stock: 40,
  },
  {
    id: 35,
    product: {
      image: "/images/product/product-default.png",
      name: "Cake Stencils Set",
      productId: "BKG-1035",
    },
    category: "Decorating Tools",
    price: "$17.99",
    stock: 25,
  },
  {
    id: 36,
    product: {
      image: "/images/product/product-default.png",
      name: "Bread Proofing Basket",
      productId: "BKG-1036",
    },
    category: "Baking Tools",
    price: "$21.99",
    stock: 15,
  },
  {
    id: 37,
    product: {
      image: "/images/product/product-default.png",
      name: "Cake Pop Maker",
      productId: "BKG-1037",
    },
    category: "Appliances",
    price: "$39.99",
    stock: 12,
  },
  {
    id: 38,
    product: {
      image: "/images/product/product-default.png",
      name: "Pastry Mat",
      productId: "BKG-1038",
    },
    category: "Baking Tools",
    price: "$19.99",
    stock: 30,
  },
  {
    id: 39,
    product: {
      image: "/images/product/product-default.png",
      name: "Icing Color Set",
      productId: "BKG-1039",
    },
    category: "Decorating Tools",
    price: "$16.99",
    stock: 35,
  },
  {
    id: 40,
    product: {
      image: "/images/product/product-default.png",
      name: "Cookie Cooling Grid",
      productId: "BKG-1040",
    },
    category: "Baking Tools",
    price: "$13.99",
    stock: 28,
  },
  {
    id: 41,
    product: {
      image: "/images/product/product-default.png",
      name: "Cake Board Set",
      productId: "BKG-1041",
    },
    category: "Display",
    price: "$11.99",
    stock: 40,
  },
  {
    id: 42,
    product: {
      image: "/images/product/product-default.png",
      name: "Fondant Smoother",
      productId: "BKG-1042",
    },
    category: "Decorating Tools",
    price: "$8.99",
    stock: 45,
  },
  {
    id: 43,
    product: {
      image: "/images/product/product-default.png",
      name: "Pie Dish Set",
      productId: "BKG-1043",
    },
    category: "Baking Molds",
    price: "$32.99",
    stock: 20,
  },
  {
    id: 44,
    product: {
      image: "/images/product/product-default.png",
      name: "Cake Dowels Set",
      productId: "BKG-1044",
    },
    category: "Decorating Tools",
    price: "$9.99",
    stock: 50,
  },
  {
    id: 45,
    product: {
      image: "/images/product/product-default.png",
      name: "Baking Paper Set",
      productId: "BKG-1045",
    },
    category: "Baking Tools",
    price: "$6.99",
    stock: 60,
  },
];

export default function ProductList() {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    productId: "",
    category: "",
    price: "",
    stock: 0,
    image: ""
  });
  const [imagePreview, setImagePreview] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (product: Product) => {
    console.log("Product being edited:", product); // For debugging
    setCurrentProduct(product);
    setEditForm({
      name: product.product.name,
      productId: product.product.productId,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.product.image
    });
    setImagePreview(product.product.image);
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
        setSelectedImage(file);
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
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      // Add other form data
      Object.keys(editForm).forEach(key => {
        formData.append(key, editForm[key as keyof typeof editForm].toString());
      });

      // Handle save logic here
      console.log("Saving changes...", editForm);
      console.log("New image:", selectedImage);

      // Reset states
      setSelectedImage(null);
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  const handleDelete = (productId: number) => {
    // Set the product ID to delete and open the confirmation modal
    setProductToDelete(productId);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      // Here you would call your API to delete the product
      console.log("Deleting product:", productToDelete);

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // After successful deletion, you would typically refresh the product list
      // For now, we'll just close the modal
      closeDeleteModal();
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = tableData.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(tableData.length / productsPerPage);

  return (
    <>
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
            Delete Product
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={closeDeleteModal}
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
        </div>
      </Modal>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Product
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Category
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Stock
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                {currentProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]">
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={product.product.image}
                            alt={product.product.name}
                            priority={true}
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                            {product.product.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-300">
                            {product.product.productId}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300">
                      {product.category}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300">
                      <Badge
                        size="sm"
                        color={
                          product.stock === 0
                            ? "error"
                            : product.stock > 10
                            ? "success"
                            : "warning"
                        }
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : `${product.stock} in Stock`}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-300">
                      {product.price}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
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
                          onClick={() => handleDelete(product.id)}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700"
          >
            Previous
          </button>

          {[1, 2, 3].map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === pageNum
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
            disabled={currentPage === 3}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700"
          >
            Next
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-5 lg:p-6">
        <div className="mb-5">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Edit Product
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update product details
          </p>
        </div>

        <form className="space-y-4">
          {/* Product Image */}
          <div>
            <Label>Product Image</Label>
            <div className="mt-2 flex flex-col items-center justify-center gap-3">
              <img
                src={imagePreview || editForm.image}
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

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <Label>Product Name</Label>
              <Input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="w-full"
              />
            </div>

            <div>
              <Label>Product ID</Label>
              <Input
                type="text"
                value={editForm.productId}
                onChange={(e) => setEditForm({...editForm, productId: e.target.value})}
                className="w-full"
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select
                options={categoryOptions}
                value={editForm.category}
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    category: value
                  })
                }
                placeholder="Select category"
                className="w-full"
              />
            </div>

            <div>
              <Label>Price</Label>
              <Input
                type="text"
                value={editForm.price}
                onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                className="w-full"
              />
            </div>

            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                value={editForm.stock}
                onChange={(e) => setEditForm({...editForm, stock: parseInt(e.target.value)})}
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
























