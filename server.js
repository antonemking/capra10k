const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('.'));
app.use(express.json({ limit: '50mb' }));

// API endpoint to get list of images to label
app.get('/api/images', (req, res) => {
  try {
    const imagesDir = path.join(__dirname, 'goat_images');
    
    // Recursively find all image files
    function findImages(dir, imageList = []) {
      if (!fs.existsSync(dir)) {
        return imageList;
      }
      
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Recursively search subdirectories
          findImages(fullPath, imageList);
        } else if (item.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
          // Store relative path from goat_images directory
          const relativePath = path.relative(imagesDir, fullPath);
          imageList.push(relativePath);
        }
      }
      
      return imageList;
    }
    
    const imageFiles = findImages(imagesDir).sort();
    res.json(imageFiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read images directory' });
  }
});

// API endpoint to save overlay image to need review folder
app.post('/api/save-overlay', (req, res) => {
  try {
    const { filename, overlayData } = req.body;
    
    // Create need_review directory if it doesn't exist
    const needReviewDir = path.join(__dirname, 'goat_images_need_review');
    if (!fs.existsSync(needReviewDir)) {
      fs.mkdirSync(needReviewDir, { recursive: true });
    }
    
    // Extract just the filename without directory structure for cleaner organization
    const baseFilename = path.basename(filename);
    const baseName = baseFilename.replace(/\.[^/.]+$/, ""); // Remove extension
    const imageSubDir = path.join(needReviewDir, baseName);
    
    // Create subdirectory for this image pair
    if (!fs.existsSync(imageSubDir)) {
      fs.mkdirSync(imageSubDir, { recursive: true });
    }
    
    // Remove the data:image/png;base64, prefix from the base64 string
    const base64Data = overlayData.replace(/^data:image\/png;base64,/, '');
    
    // Save the overlay image in the subdirectory
    const overlayFilename = `${baseName}_overlay.png`;
    const overlayPath = path.join(imageSubDir, overlayFilename);
    
    // Save the overlay image
    fs.writeFileSync(overlayPath, base64Data, 'base64');
    
    res.json({ success: true, message: `Saved overlay to ${baseName}/${overlayFilename}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save overlay image', details: error.message });
  }
});

// API endpoint to move image to reviewed folder
app.post('/api/move-to-reviewed', (req, res) => {
  try {
    const { filename } = req.body;
    const sourcePath = path.join(__dirname, 'goat_images', filename);
    
    // Create need_review directory if it doesn't exist
    const needReviewDir = path.join(__dirname, 'goat_images_need_review');
    if (!fs.existsSync(needReviewDir)) {
      fs.mkdirSync(needReviewDir, { recursive: true });
    }
    
    // Extract just the filename without directory structure for cleaner organization
    const baseFilename = path.basename(filename);
    const baseName = baseFilename.replace(/\.[^/.]+$/, ""); // Remove extension
    const imageSubDir = path.join(needReviewDir, baseName);
    
    // Create subdirectory for this image pair (if not already created by overlay)
    if (!fs.existsSync(imageSubDir)) {
      fs.mkdirSync(imageSubDir, { recursive: true });
    }
    
    // Move the original image to the subdirectory
    const destPath = path.join(imageSubDir, baseFilename);
    fs.renameSync(sourcePath, destPath);
    
    res.json({ success: true, message: `Moved ${baseFilename} to ${baseName}/ folder` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to move image', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 