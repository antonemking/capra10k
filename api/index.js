const express = require('express');
const cors = require('cors');
const path = require('path');
const { list, put, del, copy } = require('@vercel/blob');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// API endpoint to get list of images to label
app.get('/api/images', async (req, res) => {
  try {
    // List all blobs with the 'goat_images/' prefix
    const { blobs } = await list({
      prefix: 'goat_images/',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Filter for image files and return both filename and URL
    const imageFiles = blobs
      .filter(blob => blob.pathname.toLowerCase().match(/\.(jpg|jpeg|png)$/))
      .map(blob => ({
        filename: blob.pathname.replace('goat_images/', ''),
        url: blob.url
      }))
      .sort((a, b) => a.filename.localeCompare(b.filename));

    res.json(imageFiles);
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({ error: 'Failed to read images from blob storage' });
  }
});

// API endpoint to save overlay image to need review folder
app.post('/api/save-overlay', async (req, res) => {
  try {
    const { filename, overlayData } = req.body;

    // Extract just the filename without directory structure for cleaner organization
    const baseFilename = path.basename(filename);
    const baseName = baseFilename.replace(/\.[^/.]+$/, ""); // Remove extension

    // Remove the data:image/png;base64, prefix from the base64 string
    const base64Data = overlayData.replace(/^data:image\/png;base64,/, '');

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Save the overlay image to blob storage
    const overlayFilename = `${baseName}_overlay.png`;
    const blobPath = `goat_images_need_review/${baseName}/${overlayFilename}`;

    await put(blobPath, imageBuffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: 'image/png',
    });

    res.json({ success: true, message: `Saved overlay to ${baseName}/${overlayFilename}` });
  } catch (error) {
    console.error('Error saving overlay:', error);
    res.status(500).json({ error: 'Failed to save overlay image', details: error.message });
  }
});

// API endpoint to move image to reviewed folder
app.post('/api/move-to-reviewed', async (req, res) => {
  try {
    const { filename } = req.body;

    // Extract just the filename without directory structure for cleaner organization
    const baseFilename = path.basename(filename);
    const baseName = baseFilename.replace(/\.[^/.]+$/, ""); // Remove extension

    // Source and destination paths in blob storage
    const sourcePath = `goat_images/${filename}`;
    const destPath = `goat_images_need_review/${baseName}/${baseFilename}`;

    // Copy the blob to the new location
    await copy(sourcePath, destPath, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Delete the original blob
    await del(sourcePath, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.json({ success: true, message: `Moved ${baseFilename} to ${baseName}/ folder` });
  } catch (error) {
    console.error('Error moving image:', error);
    res.status(500).json({ error: 'Failed to move image', details: error.message });
  }
});

// Export the Express app for Vercel
module.exports = app;
