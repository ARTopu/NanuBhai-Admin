# Backend Implementation Guide for Category Creation

This guide explains how to implement the backend code to properly handle category creation with images.

## Category Model

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true
  },
  description: {
    type: String,
    default: null,
    trim: true
  },
  imageUrl: {
    type: String,
    default: null  // Important: Use null, not empty string
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
```

## File Upload Configuration

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'Uploads', 'Category');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'category-image_' + uniqueSuffix + ext);
  }
});

// Create multer upload instance
const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});
```

## Category Controller

```javascript
const Category = require('../models/Category');

// Create category controller
exports.createCategory = async (req, res) => {
  try {
    console.log('Create category request received');
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    
    const { name, description } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        succeeded: false,
        data: null,
        message: 'Category name is required',
        errors: ['Category name is required']
      });
    }
    
    // Create category object
    const categoryData = {
      name,
      description: description || null
    };
    
    // Handle image - IMPORTANT: Only set imageUrl if a file was uploaded
    if (req.file) {
      // Use forward slashes for consistency in paths
      const relativePath = `Uploads/Category/${req.file.filename}`;
      categoryData.imageUrl = relativePath;
      console.log('Image path set to:', relativePath);
    } else {
      // Explicitly set to null, not empty string
      categoryData.imageUrl = null;
      console.log('No image uploaded, setting imageUrl to null');
    }
    
    // Create and save the category
    const category = new Category(categoryData);
    const savedCategory = await category.save();
    
    console.log('Category saved successfully:', savedCategory);
    
    // Return success response
    res.status(201).json({
      succeeded: true,
      data: savedCategory,
      message: 'Category created successfully',
      errors: null
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      succeeded: false,
      data: null,
      message: 'Failed to create category',
      errors: [error.message]
    });
  }
};
```

## Route Configuration

```javascript
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { upload } = require('../config/multer');

// Create category route - use upload.single for image handling
router.post('/api/Category/Create', upload.single('image'), categoryController.createCategory);

module.exports = router;
```

## Express App Configuration

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files - IMPORTANT for accessing uploaded images
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

// Routes
app.use(categoryRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/BazarKori', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Key Points to Fix the Empty imageUrl Issue

1. **Set Default to null, not empty string**: In your Mongoose schema, set the default value for imageUrl to `null`, not an empty string.

2. **Only Set imageUrl When a File Exists**: Only set the imageUrl field when req.file exists, otherwise explicitly set it to null.

3. **Use Consistent Path Format**: Use forward slashes in the path (e.g., 'Uploads/Category/filename.jpg') for consistency.

4. **Serve Static Files**: Make sure your Express app serves the Uploads directory as static files.

5. **Check File Upload Configuration**: Ensure multer is properly configured to save files in the correct location.

By following these guidelines, the imageUrl field in your database will be properly set to null when no image is uploaded, and to the correct path when an image is uploaded.
