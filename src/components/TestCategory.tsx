"use client";
import React, { useState } from "react";
import axios from 'axios';

export default function TestCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setIsLoading(true);

    try {
      // Simple approach - direct axios call
      console.log('Testing category creation with simple data');

      // Try with FormData
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      console.log('Form data created with name:', name);
      console.log('Form data created with description:', description);

      // Direct API call
      const url = 'http://localhost:4000/api/Category/Create';
      console.log('Sending request to:', url);

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);
      setStatus('Category created successfully!');

      // Reset form
      setName("");
      setDescription("");
    } catch (err: any) {
      console.error('Error creating category:', err);

      let errorMessage = 'Failed to create category';

      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Status:', err.response.status);

        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      // Try alternative approach with JSON
      try {
        console.log('Trying alternative approach with JSON');

        const jsonData = {
          name,
          description
        };

        const jsonResponse = await axios.post('http://localhost:4000/api/Category/Create', jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('JSON approach succeeded:', jsonResponse.data);
        setStatus('Category created successfully with JSON approach!');

        // Reset form
        setName("");
        setDescription("");
      } catch (jsonErr: any) {
        console.error('JSON approach also failed:', jsonErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Test Category Creation</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Category'}
        </button>
      </form>

      {status && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md">
          {status}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Troubleshooting Tips</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
          <li>Make sure your backend server is running on port 4000</li>
          <li>Check the server logs for detailed error information</li>
          <li>Verify that MongoDB is running and accessible</li>
          <li>Check for CORS issues in the browser console</li>
        </ul>
      </div>
    </div>
  );
}
