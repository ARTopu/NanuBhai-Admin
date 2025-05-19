const Category = require('../models/Category');

// Controller function to get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    
    res.status(200).json({
      succeeded: true,
      data: categories,
      message: 'Categories retrieved successfully',
      errors: null
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      data: null,
      message: 'Failed to retrieve categories',
      errors: [error.message]
    });
  }
};

// Controller function to create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Handle image if uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = `Uploads/Category/${req.file.filename}`;
    }
    
    // Create new category
    const category = new Category({
      name,
      description,
      imageUrl
    });
    
    // Save to database
    const savedCategory = await category.save();
    
    // Return success response
    res.status(201).json({
      succeeded: true,
      data: savedCategory,
      message: 'Category created successfully',
      errors: null
    });
  } catch (error) {
    res.status(400).json({
      succeeded: false,
      data: null,
      message: 'Failed to create category',
      errors: [error.message]
    });
  }
};

// Controller function to update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.body;
    const { name, description } = req.body;
    
    // Find the category
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        succeeded: false,
        data: null,
        message: 'Category not found',
        errors: ['Category with the specified ID was not found']
      });
    }
    
    // Update fields
    category.name = name || category.name;
    category.description = description || category.description;
    
    // Update image if provided
    if (req.file) {
      category.imageUrl = `Uploads/Category/${req.file.filename}`;
    }
    
    // Save the updated category
    const updatedCategory = await category.save();
    
    res.status(200).json({
      succeeded: true,
      data: updatedCategory,
      message: 'Category updated successfully',
      errors: null
    });
  } catch (error) {
    res.status(400).json({
      succeeded: false,
      data: null,
      message: 'Failed to update category',
      errors: [error.message]
    });
  }
};

// Controller function to delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;
    
    // Find and delete the category
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({
        succeeded: false,
        data: null,
        message: 'Category not found',
        errors: ['Category with the specified ID was not found']
      });
    }
    
    res.status(200).json({
      succeeded: true,
      data: null,
      message: 'Category deleted successfully',
      errors: null
    });
  } catch (error) {
    res.status(400).json({
      succeeded: false,
      data: null,
      message: 'Failed to delete category',
      errors: [error.message]
    });
  }
};
