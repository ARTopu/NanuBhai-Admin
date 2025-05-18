"use client";
import React, { useState } from "react";
import axios from 'axios';

export default function TestImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult("");

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('CategoryId', '15'); // Use a valid category ID
      formData.append('Name', 'Test Subcategory');
      formData.append('Description', 'Test Description');
      
      // Try with different field names
      formData.append('ImageFile', file);
      
      // Log what we're sending
      console.log('Sending file:', file.name, file.size, file.type);
      
      // Make the API call
      const response = await axios.post(
        'https://localhost:7293/api/SubCategory/Create',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setResult(JSON.stringify(response.data, null, 2));
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Image Upload</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Select Image:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="border p-2 w-full"
          />
        </div>
        <button 
          type="submit" 
          disabled={!file || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      
      {result && (
        <div className="mt-4">
          <h3 className="font-bold">Result:</h3>
          <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto max-h-60">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
