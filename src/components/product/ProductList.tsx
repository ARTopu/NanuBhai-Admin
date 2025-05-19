"use client";

import React, { useState, useEffect } from "react";
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
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";

// Define interfaces for the API response
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  previousPrice: number | null;
  discountPercentage: number;
  savedAmount: number;
  quantity: number;
  stockStatus: "inStock" | "outOfStock";
  freeDelivery: "yes" | "no";
  categoryId: string;
  imageUrl: string;
  images: string[];
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

interface EditFormState {
  name: string;
  description: string;
  price: number;
  previousPrice: number | null;
  quantity: number;
  stockStatus: string;
  freeDelivery: string;
  categoryId: string;
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

// Constants
const ITEMS_PER_PAGE = 15; // Number of products to show per page

export default function ProductList() {
  // State for products and categories
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for editing
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    description: "",
    price: 0,
    previousPrice: null,
    quantity: 0,
    stockStatus: "inStock",
    freeDelivery: "no",
    categoryId: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check backend connection first
        const isBackendConnected = await checkBackendConnection();
        if (!isBackendConnected) {
          setError("Cannot connect to the backend server. Please make sure your backend server is running at http://localhost:4000. Check the browser console for more details on connection attempts.");
          setIsLoading(false);
          return;
        }

        // Fetch products with a timestamp to prevent caching
        const timestamp = new Date().getTime();
        console.log(`Fetching products at ${new Date().toLocaleTimeString()}...`);

        const productsResponse = await productService.getProducts(`?_t=${timestamp}`);
        console.log('Products API Response:', productsResponse.data);

        if (productsResponse.data && productsResponse.data.succeeded) {
          console.log(`Received ${productsResponse.data.data.length} products`);

          // Log the first product to see its structure
          if (productsResponse.data.data.length > 0) {
            console.log('First product data:', JSON.stringify(productsResponse.data.data[0], null, 2));

            // Log image information specifically
            const firstProduct = productsResponse.data.data[0];
            console.log('Product image info:', {
              imageUrl: firstProduct.imageUrl,
              imageUrlType: typeof firstProduct.imageUrl,
              images: firstProduct.images,
              imagesType: typeof firstProduct.images,
              isImagesArray: Array.isArray(firstProduct.images),
              formattedImageUrl: getProductImage(firstProduct)
            });

            // Check all products for image issues
            console.log('Checking all products for image issues...');
            productsResponse.data.data.forEach((product, index) => {
              if (!product.imageUrl && (!product.images || !Array.isArray(product.images) || product.images.length === 0)) {
                console.warn(`Product #${index + 1} (${product.name}) has no images`);
              }
              if (product.images && !Array.isArray(product.images)) {
                console.error(`Product #${index + 1} (${product.name}) has images property that is not an array:`, product.images);
              }
            });
          }

          setProducts(productsResponse.data.data);



          // Calculate total pages based on the number of products and items per page
          const calculatedPages = Math.ceil(productsResponse.data.data.length / ITEMS_PER_PAGE);
          console.log(`Calculated ${calculatedPages} total pages based on ${productsResponse.data.data.length} products and ${ITEMS_PER_PAGE} items per page`);

          // Ensure we have at least 1 page, and at most 3 pages (to match the UI)
          const finalPages = Math.min(Math.max(calculatedPages, 1), 3);
          setTotalPages(finalPages);
          setCurrentPage(1); // Reset to first page when data is refreshed
        } else {
          console.error('Failed to fetch products:', productsResponse.data?.message);
          setError("Failed to fetch products: " + (productsResponse.data?.message || 'Unknown error'));
        }

        // Fetch categories
        console.log('Fetching categories...');
        const categoriesResponse = await categoryService.getCategories();

        if (categoriesResponse.data && categoriesResponse.data.succeeded) {
          console.log(`Received ${categoriesResponse.data.data.length} categories`);
          setCategories(categoriesResponse.data.data);
        } else {
          console.error('Failed to fetch categories:', categoriesResponse.data?.message);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data: " + (err.message || 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Add a refresh interval (optional - remove if not needed)
    // const refreshInterval = setInterval(fetchData, 60000); // Refresh every minute

    // return () => {
    //   clearInterval(refreshInterval);
    // };
  }, []);

  // Get category name by ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id.toString() === categoryId);
    return category ? category.name : "Unknown Category";
  };

  // Default image path
  const DEFAULT_IMAGE = "/images/product/product-default.png";

  // Get image URL for product - simplified to match category list approach
  const getProductImage = (product: Product | null | undefined): string => {
    // Check if product is valid
    if (!product) {
      console.warn('Invalid product object:', product);
      return DEFAULT_IMAGE;
    }

    console.log('Getting image for product:', product.name);

    // If there's an image in the images array, use the first one
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      console.log('Using first image from images array:', product.images[0]);
      return getImageUrl(product.images[0]);
    }

    // Otherwise use the imageUrl if available
    if (product.imageUrl) {
      console.log('Using imageUrl property:', product.imageUrl);
      return getImageUrl(product.imageUrl);
    }

    // Default image if none available
    console.log('No image found, using default');
    return DEFAULT_IMAGE;
  };

  // Utility function to get the correct image URL - same as in category list
  const getImageUrl = (imageUrl: any): string => {
    console.log('Processing image URL:', imageUrl, 'Type:', typeof imageUrl);

    // Check if imageUrl is null, undefined, or not a string
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.warn('Invalid image URL:', imageUrl);
      return DEFAULT_IMAGE;
    }

    // If the URL already includes http:// or https://, return it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      console.log('URL already has http/https, using as is');
      return imageUrl;
    }

    // If the URL starts with a slash, remove it
    const cleanUrl = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;

    // Otherwise, prepend the backend URL
    const fullUrl = `http://localhost:4000/${cleanUrl}`;
    console.log('Final formatted URL:', fullUrl);
    return fullUrl;
  };

  // Handle edit button click
  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      previousPrice: product.previousPrice,
      quantity: product.quantity,
      stockStatus: product.stockStatus,
      freeDelivery: product.freeDelivery,
      categoryId: product.categoryId,
    });
    // Set image preview using our getProductImage function
    const imageUrl = getProductImage(product);
    console.log('Setting image preview to:', imageUrl);
    setImagePreview(imageUrl);
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
    if (!currentProduct) return;

    try {
      // Create form data
      const formData = new FormData();

      // Add basic product information
      formData.append('id', currentProduct.id);
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price.toString());
      if (editForm.previousPrice) {
        formData.append('previousPrice', editForm.previousPrice.toString());
      }
      formData.append('quantity', editForm.quantity.toString());
      formData.append('stockStatus', editForm.stockStatus);
      formData.append('freeDelivery', editForm.freeDelivery);
      formData.append('categoryId', editForm.categoryId);

      // Add image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
        console.log("Adding image to form data:", selectedImage.name);
      }

      // Show loading message
      setIsLoading(true);

      // Update product by calling the API
      console.log("Saving changes to product ID:", currentProduct.id);

      try {
        const response = await productService.updateProduct(currentProduct.id, formData);
        console.log("Update response:", response.data);

        if (response.data && response.data.succeeded) {
          alert("Product updated successfully!");

          // Refresh the product list to show the updated data
          await refreshData();
        } else {
          alert("Failed to update product: " + (response.data?.message || "Unknown error"));
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        alert("Error updating product. See console for details.");
      } finally {
        setIsLoading(false);
      }

      // Reset states
      setSelectedImage(null);
      closeModal();

    } catch (error) {
      console.error("Error saving product:", error);
      setIsLoading(false);
    }
  };

  // Handle delete button click
  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    openDeleteModal();
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);

      // Delete product by calling the API
      console.log("Deleting product:", productToDelete);

      try {
        const response = await productService.deleteProduct(productToDelete);
        console.log("Delete response:", response.data);

        if (response.data && response.data.succeeded) {
          alert("Product deleted successfully!");

          // Refresh the product list to show the updated data
          await refreshData();
        } else {
          alert("Failed to delete product: " + (response.data?.message || "Unknown error"));
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        alert("Error deleting product. See console for details.");
      }

      closeDeleteModal();
      setProductToDelete(null);

    } catch (err) {
      console.error('Error deleting product:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to check if the backend is accessible
  const checkBackendConnection = async () => {
    // List of endpoints to try
    const endpoints = [
      'http://localhost:4000/api/health',
      'http://localhost:4000/api/Product/GetAll',
      'http://localhost:4000/api/Category/GetAll',
      'http://localhost:4000',
      'http://127.0.0.1:4000/api/Product/GetAll'
    ];

    console.log('Checking backend connection...');

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying to connect to: ${endpoint}`);
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Accept': 'application/json, text/plain, */*' },
          mode: 'cors',
          cache: 'no-cache',
          timeout: 5000
        });

        console.log(`Response from ${endpoint}:`, response.status);

        if (response.ok) {
          console.log(`Backend connection successful at ${endpoint}`);
          return true;
        } else {
          console.warn(`Connection to ${endpoint} failed with status:`, response.status);
        }
      } catch (error) {
        console.error(`Error connecting to ${endpoint}:`, error);
      }
    }

    // If we get here, all connection attempts failed
    console.error('All backend connection attempts failed');
    return false;
  };

  // Use the constant for items per page
  const itemsPerPage = ITEMS_PER_PAGE;

  // Calculate pagination indices
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

  // Get products for the current page only
  const currentProducts = isLoading ? [] :
    products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Log pagination info for debugging
  console.log(`Showing products ${indexOfFirstProduct + 1} to ${Math.min(indexOfLastProduct, products.length)} of ${products.length} total`);
  console.log(`Current page: ${currentPage}, Total pages: ${totalPages}`);

  // Get stock status badge
  const getStockStatusBadge = (product: Product) => {
    if (product.stockStatus === "outOfStock") {
      return (
        <Badge variant="light" color="error">
          Out of Stock
        </Badge>
      );
    } else {
      // In stock - check quantity
      if (product.quantity < 10) {
        return (
          <Badge variant="light" color="warning">
            {product.quantity} in Stock
          </Badge>
        );
      } else {
        return (
          <Badge variant="light" color="success">
            {product.quantity} in Stock
          </Badge>
        );
      }
    }
  };

  // Get free delivery badge
  const getFreeDeliveryBadge = (freeDelivery: string) => {
    if (freeDelivery === "yes") {
      return (
        <Badge variant="light" color="success">
          Free Delivery
        </Badge>
      );
    } else {
      return (
        <Badge variant="light" color="error">
          Paid Delivery
        </Badge>
      );
    }
  };

  // Function to manually refresh data
  const refreshData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check backend connection first
      const isBackendConnected = await checkBackendConnection();
      if (!isBackendConnected) {
        setError("Cannot connect to the backend server. Please make sure your backend server is running at http://localhost:4000. Check the browser console for more details on connection attempts.");
        setIsLoading(false);
        return;
      }

      // Fetch products with a timestamp to prevent caching
      const timestamp = new Date().getTime();
      console.log(`Manually refreshing products at ${new Date().toLocaleTimeString()}...`);

      const productsResponse = await productService.getProducts(`?_t=${timestamp}`);

      if (productsResponse.data && productsResponse.data.succeeded) {
        console.log(`Received ${productsResponse.data.data.length} products`);
        setProducts(productsResponse.data.data);



        // Calculate total pages based on the number of products and items per page
        const calculatedPages = Math.ceil(productsResponse.data.data.length / ITEMS_PER_PAGE);

        // Ensure we have at least 1 page, and at most 3 pages (to match the UI)
        const finalPages = Math.min(Math.max(calculatedPages, 1), 3);
        setTotalPages(finalPages);
        setCurrentPage(1); // Reset to first page when data is refreshed

        // Show success message (optional)
        alert(`Successfully refreshed data. Found ${productsResponse.data.data.length} products.`);
      } else {
        setError("Failed to refresh products: " + (productsResponse.data?.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error("Error refreshing data:", err);
      setError("An error occurred while refreshing data: " + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    // Check if it's a backend connection error
    const isConnectionError = error.includes("Cannot connect to the backend server");

    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4 font-semibold text-lg">{error}</div>

        {isConnectionError && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left max-w-2xl mx-auto">
            <h3 className="font-medium mb-2 text-gray-800 dark:text-white">Troubleshooting Steps:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Make sure your backend server is running on port 4000</li>
              <li>Check if there are any CORS issues in the browser console</li>
              <li>Verify that the API endpoints are correct in your backend code</li>
              <li>Try restarting your backend server</li>
              <li>Check if your backend server logs show any errors</li>
            </ol>

            <div className="mt-4">
              <h4 className="font-medium mb-2 text-gray-800 dark:text-white">Test API Endpoints:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('http://localhost:4000/api/Product/GetAll');
                      const data = await response.json();
                      console.log('Product API Response:', data);
                      alert(`Status: ${response.status}\nCheck console for full response`);
                    } catch (err) {
                      console.error('Error:', err);
                      alert(`Error: ${err.message}`);
                    }
                  }}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Test Products API
                </button>

                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('http://localhost:4000/api/Category/GetAll');
                      const data = await response.json();
                      console.log('Category API Response:', data);
                      alert(`Status: ${response.status}\nCheck console for full response`);
                    } catch (err) {
                      console.error('Error:', err);
                      alert(`Error: ${err.message}`);
                    }
                  }}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Test Categories API
                </button>

                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('http://localhost:4000');
                      alert(`Status: ${response.status}\nServer is reachable`);
                    } catch (err) {
                      console.error('Error:', err);
                      alert(`Error: ${err.message}`);
                    }
                  }}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Test Server Root
                </button>

                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('http://127.0.0.1:4000/api/Product/GetAll');
                      const data = await response.json();
                      console.log('IP Address API Response:', data);
                      alert(`Status: ${response.status}\nCheck console for full response`);
                    } catch (err) {
                      console.error('Error:', err);
                      alert(`Error: ${err.message}`);
                    }
                  }}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Test with IP Address
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>

          <button
            onClick={async () => {
              // Test connection using the product service's testConnection method
              try {
                const isConnected = await productService.testConnection();
                if (isConnected) {
                  alert('Backend connection successful! Try refreshing the data now.');
                } else {
                  alert('Backend connection failed. Please check that your backend server is running.');
                }
              } catch (err) {
                console.error('Error testing connection:', err);
                alert('Error testing connection. See console for details.');
              }
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Test Connection
          </button>

          <button
            onClick={async () => {
              try {
                // Show loading message
                alert('Fetching products... Check the console for the full response.');

                // Make the API call with a timestamp to prevent caching
                const timestamp = new Date().getTime();
                const response = await productService.getProducts(`?_t=${timestamp}`);

                // Show a summary of the response
                if (response.data && response.data.succeeded) {
                  const products = response.data.data;
                  const summary = `Successfully retrieved ${products.length} products.\n\n` +
                    `First product:\n` +
                    `- Name: ${products[0]?.name || 'N/A'}\n` +
                    `- Price: ${products[0]?.price || 'N/A'}\n` +
                    `- Image URL: ${products[0]?.imageUrl || 'N/A'}\n\n` +
                    `Check the browser console for the complete response.`;

                  alert(summary);
                } else {
                  alert(`API request failed: ${response.data?.message || 'Unknown error'}`);
                }
              } catch (err) {
                console.error('Error fetching products:', err);
                alert(`Error fetching products: ${err.message || 'Unknown error'}`);
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Show API Response
          </button>

          <button
            onClick={async () => {
              try {
                // Show loading message
                alert('Testing image URLs... Check the console for results.');

                // Make the API call with a timestamp to prevent caching
                const timestamp = new Date().getTime();
                const response = await productService.getProducts(`?_t=${timestamp}`);

                if (response.data && response.data.succeeded) {
                  const products = response.data.data;

                  // Create a div to display the images
                  const testDiv = document.createElement('div');
                  testDiv.style.position = 'fixed';
                  testDiv.style.top = '20px';
                  testDiv.style.right = '20px';
                  testDiv.style.zIndex = '9999';
                  testDiv.style.background = 'white';
                  testDiv.style.padding = '10px';
                  testDiv.style.border = '1px solid black';
                  testDiv.style.borderRadius = '5px';
                  testDiv.style.maxHeight = '80vh';
                  testDiv.style.overflow = 'auto';
                  testDiv.style.maxWidth = '300px';

                  // Add a close button
                  const closeButton = document.createElement('button');
                  closeButton.textContent = 'Close';
                  closeButton.style.marginBottom = '10px';
                  closeButton.style.padding = '5px 10px';
                  closeButton.style.background = 'red';
                  closeButton.style.color = 'white';
                  closeButton.style.border = 'none';
                  closeButton.style.borderRadius = '3px';
                  closeButton.onclick = () => document.body.removeChild(testDiv);
                  testDiv.appendChild(closeButton);

                  // Add a title
                  const title = document.createElement('h3');
                  title.textContent = 'Image URL Test';
                  title.style.marginBottom = '10px';
                  testDiv.appendChild(title);

                  // Test the first 3 products
                  const testProducts = products.slice(0, 3);

                  testProducts.forEach((product, index) => {
                    console.log(`Testing image for product ${index + 1}:`, product.name);

                    // Create a container for this product
                    const productDiv = document.createElement('div');
                    productDiv.style.marginBottom = '15px';
                    productDiv.style.padding = '10px';
                    productDiv.style.border = '1px solid #ccc';
                    productDiv.style.borderRadius = '3px';

                    // Add product name
                    const nameElem = document.createElement('p');
                    nameElem.textContent = `${index + 1}. ${product.name}`;
                    nameElem.style.fontWeight = 'bold';
                    nameElem.style.marginBottom = '5px';
                    productDiv.appendChild(nameElem);

                    // Add image URL
                    const urlElem = document.createElement('p');
                    urlElem.textContent = `URL: ${product.imageUrl || 'N/A'}`;
                    urlElem.style.fontSize = '12px';
                    urlElem.style.wordBreak = 'break-all';
                    urlElem.style.marginBottom = '5px';
                    productDiv.appendChild(urlElem);

                    // Test different image URL formats
                    const urlFormats = [
                      { label: 'Original', url: product.imageUrl },
                      { label: 'With localhost', url: `http://localhost:4000/${product.imageUrl}` },
                      { label: 'With IP', url: `http://127.0.0.1:4000/${product.imageUrl}` },
                      { label: 'Cleaned path', url: product.imageUrl ? `http://localhost:4000/${product.imageUrl.replace(/^\//, '')}` : null }
                    ];

                    urlFormats.forEach(format => {
                      if (!format.url) return;

                      // Create a container for this format
                      const formatDiv = document.createElement('div');
                      formatDiv.style.marginBottom = '10px';

                      // Add format label
                      const formatLabel = document.createElement('p');
                      formatLabel.textContent = format.label;
                      formatLabel.style.fontSize = '12px';
                      formatLabel.style.fontWeight = 'bold';
                      formatDiv.appendChild(formatLabel);

                      // Add image
                      const img = document.createElement('img');
                      img.src = format.url;
                      img.alt = `${product.name} - ${format.label}`;
                      img.style.width = '100%';
                      img.style.height = 'auto';
                      img.style.maxHeight = '100px';
                      img.style.objectFit = 'contain';
                      img.style.border = '1px solid #eee';
                      img.style.borderRadius = '3px';
                      img.style.marginBottom = '5px';

                      // Add load/error handlers
                      img.onload = () => {
                        console.log(`Image loaded successfully: ${format.label} - ${format.url}`);
                        img.style.border = '2px solid green';
                      };
                      img.onerror = () => {
                        console.error(`Image failed to load: ${format.label} - ${format.url}`);
                        img.style.border = '2px solid red';
                        img.style.opacity = '0.5';
                      };

                      formatDiv.appendChild(img);
                      productDiv.appendChild(formatDiv);
                    });

                    testDiv.appendChild(productDiv);
                  });

                  // Add the test div to the body
                  document.body.appendChild(testDiv);

                } else {
                  alert(`API request failed: ${response.data?.message || 'Unknown error'}`);
                }
              } catch (err) {
                console.error('Error testing image URLs:', err);
                alert(`Error testing image URLs: ${err.message || 'Unknown error'}`);
              }
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Test Image URLs
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">No products found.</p>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Refresh Data
        </button>
      </div>
    );
  }
  // Category options for the edit form
  const categoryOptions = categories.map(category => ({
    value: category.id.toString(),
    label: category.name
  }));

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
      {/* Simple header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Product List
        </h2>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="w-full">
          <div className="w-full">
            <Table className="w-full">
              <TableHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-[18%]"
                  >
                    Product
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-[22%]"
                  >
                    Description
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-[10%]"
                  >
                    Category
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400 w-[8%]"
                  >
                    Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400 w-[8%]"
                  >
                    Previous Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 w-[8%]"
                  >
                    Discount
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400 w-[8%]"
                  >
                    Saved Amount
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 w-[8%]"
                  >
                    Stock
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 w-[8%]"
                  >
                    Free Delivery
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 w-[8%]"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                {currentProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]">
                    {/* Product Name with Image */}
                    <TableCell className="px-5 py-4 sm:px-6 text-start w-[18%]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full flex-shrink-0">
                          <Image
                            width={40}
                            height={40}
                            src={getProductImage(product)}
                            alt={product.name}
                            priority={true}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              console.error('Error loading image for product:', product.name);
                              // Fallback to default image on error
                              (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white break-words">
                            {product.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Description */}
                    <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-300 w-[22%]">
                      <div className="max-w-full line-clamp-2">
                        {product.description}
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-300 w-[10%]">
                      {getCategoryName(product.categoryId)}
                    </TableCell>

                    {/* Price */}
                    <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-300 w-[8%] text-right">
                      ${product.price.toFixed(2)}
                    </TableCell>

                    {/* Previous Price */}
                    <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-300 w-[10%] text-right">
                      {product.previousPrice ? `$${product.previousPrice.toFixed(2)}` : '-'}
                    </TableCell>

                    {/* Discount Percentage */}
                    <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-300 w-[100px] text-center">
                      {product.discountPercentage > 0 ? `${product.discountPercentage}%` : '-'}
                    </TableCell>

                    {/* Saved Amount */}
                    <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-300 w-[120px] text-right">
                      {product.savedAmount > 0 ? `$${product.savedAmount.toFixed(2)}` : '-'}
                    </TableCell>

                    {/* Stock Status */}
                    <TableCell className="px-4 py-3 w-[120px] text-center">
                      {getStockStatusBadge(product)}
                    </TableCell>

                    {/* Free Delivery */}
                    <TableCell className="px-4 py-3 w-[120px] text-center">
                      {getFreeDeliveryBadge(product.freeDelivery)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3 text-gray-700 text-center text-theme-sm dark:text-gray-300 w-[100px]">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="inline-flex items-center justify-center p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-500/10"
                          title="Edit"
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
                          title="Delete"
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
      {/* Pagination controls - restored to original */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700"
          >
            Previous
          </button>

          {/* Original pagination buttons - only show up to totalPages */}
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pageNum) => (
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
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
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
                src={imagePreview || (currentProduct ? getProductImage(currentProduct) : DEFAULT_IMAGE)}
                alt={editForm.name}
                className="h-32 w-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                onError={(e) => {
                  console.error('Error loading image in modal for product:', currentProduct?.name);
                  // Fallback to default image on error
                  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                }}
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
              <Label>Description</Label>
              <Input
                type="text"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                className="w-full"
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select
                options={categoryOptions}
                value={editForm.categoryId}
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    categoryId: value
                  })
                }
                placeholder="Select category"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                  className="w-full"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label>Previous Price</Label>
                <Input
                  type="number"
                  value={editForm.previousPrice || ''}
                  onChange={(e) => setEditForm({...editForm, previousPrice: e.target.value ? parseFloat(e.target.value) : null})}
                  className="w-full"
                  min="0"
                  step="0.01"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={editForm.quantity}
                onChange={(e) => setEditForm({...editForm, quantity: parseInt(e.target.value)})}
                className="w-full"
                min="0"
              />
            </div>

            <div>
              <Label>Stock Status</Label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="inStock"
                    name="stockStatus"
                    value="inStock"
                    checked={editForm.stockStatus === "inStock"}
                    onChange={() => setEditForm({...editForm, stockStatus: "inStock"})}
                    className="mr-2"
                  />
                  <label htmlFor="inStock">In Stock</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="outOfStock"
                    name="stockStatus"
                    value="outOfStock"
                    checked={editForm.stockStatus === "outOfStock"}
                    onChange={() => setEditForm({...editForm, stockStatus: "outOfStock"})}
                    className="mr-2"
                  />
                  <label htmlFor="outOfStock">Out of Stock</label>
                </div>
              </div>
            </div>

            <div>
              <Label>Free Delivery</Label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="freeDeliveryYes"
                    name="freeDelivery"
                    value="yes"
                    checked={editForm.freeDelivery === "yes"}
                    onChange={() => setEditForm({...editForm, freeDelivery: "yes"})}
                    className="mr-2"
                  />
                  <label htmlFor="freeDeliveryYes">Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="freeDeliveryNo"
                    name="freeDelivery"
                    value="no"
                    checked={editForm.freeDelivery === "no"}
                    onChange={() => setEditForm({...editForm, freeDelivery: "no"})}
                    className="mr-2"
                  />
                  <label htmlFor="freeDeliveryNo">No</label>
                </div>
              </div>
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
























