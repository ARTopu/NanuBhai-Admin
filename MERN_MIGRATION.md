# MERN Stack Migration Guide

This document provides instructions for migrating the frontend to work with the new MERN stack backend.

## Backend Information

- **MongoDB Connection String**: `localhost:27017/BazarKori`
- **API Base URL**: `http://localhost:4000/api`

## Migration Steps

### 1. Update API Configuration

1. Replace the existing service files with the new MERN-compatible versions:

   ```bash
   # Copy the new service files to replace the existing ones
   cp src/services/categoryService.new.ts src/services/categoryService.ts
   cp src/services/subCategoryService.new.ts src/services/subCategoryService.ts
   ```

2. Make sure the API configuration file is in place:

   ```bash
   # Ensure the API config file exists
   cp src/config/api.config.ts src/config/api.config.ts
   ```

### 2. Key Changes in the Migration

#### Data Model Changes

- **IDs**: Changed from numeric IDs to MongoDB string IDs (`_id`)
- **Response Format**: Changed from `{ succeeded, data, message, errors }` to `{ success, data, message, error }`
- **Image URLs**: Now need to be prefixed with the base URL

#### API Endpoint Changes

- **Categories**:
  - Old: `https://localhost:7293/api/Category/GetAll`
  - New: `http://localhost:4000/api/categories`

- **Subcategories**:
  - Old: `https://localhost:7293/api/SubCategory/GetAll`
  - New: `http://localhost:4000/api/subcategories`

#### Component Updates Needed

The following components need to be updated to work with the new API:

1. **ProductCategories.tsx**: Update to handle string IDs and new response format
2. **SubCategories.tsx**: Update to handle string IDs and new response format
3. **Any components that display images**: Update to use the full image URL

### 3. Testing the Migration

After making these changes, test the following functionality:

1. **Listing Categories**: Verify that categories are loaded correctly
2. **Creating a Category**: Test creating a new category with an image
3. **Updating a Category**: Test updating an existing category
4. **Deleting a Category**: Test deleting a category
5. **Subcategory Operations**: Test all CRUD operations for subcategories

### 4. Troubleshooting

If you encounter issues:

1. **Check the console logs**: The service files include detailed logging
2. **Verify API responses**: Compare the expected response format with what you're receiving
3. **Check image URLs**: Make sure images are displaying correctly
4. **ID type issues**: Watch for places where the code expects numeric IDs but receives string IDs

## API Response Format

### Old Format (ASP.NET Core)

```json
{
  "succeeded": true,
  "data": [...],
  "message": "Operation successful",
  "errors": null
}
```

### New Format (MERN Stack)

```json
{
  "success": true,
  "data": [...],
  "message": "Operation successful",
  "error": null
}
```

## Common Issues and Solutions

1. **Image URLs**: Images might not display correctly if the full URL isn't constructed properly
   - Solution: Use the `getFullImageUrl` helper function

2. **ID Type Errors**: MongoDB uses string IDs, while the old system used numeric IDs
   - Solution: Update any code that assumes IDs are numbers

3. **Form Data**: Make sure form field names match what the backend expects
   - Solution: Check the backend API documentation for required field names

4. **CORS Issues**: If you encounter CORS errors, make sure the backend has CORS enabled
   - Solution: The backend should allow requests from your frontend origin
