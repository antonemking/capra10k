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
    const { filename, copyOnly } = req.body;

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

    // Only delete the original if not in copy-only mode
    if (!copyOnly) {
      await del(sourcePath, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
    }

    const action = copyOnly ? 'Copied' : 'Moved';
    res.json({ success: true, message: `${action} ${baseFilename} to ${baseName}/ folder` });
  } catch (error) {
    console.error('Error moving image:', error);
    res.status(500).json({ error: 'Failed to move image', details: error.message });
  }
});

// API endpoint to get list of reviewed images with overlays
app.get('/api/reviewed-images', async (req, res) => {
  try {
    // List all blobs with the 'goat_images_need_review/' prefix
    const { blobs } = await list({
      prefix: 'goat_images_need_review/',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Group images by their base folder
    const imageGroups = {};

    blobs.forEach(blob => {
      const pathParts = blob.pathname.split('/');
      if (pathParts.length >= 3) {
        const folderName = pathParts[1]; // e.g., "goat1"
        const filename = pathParts[2];

        if (!imageGroups[folderName]) {
          imageGroups[folderName] = {};
        }

        if (filename.includes('_overlay.png')) {
          imageGroups[folderName].overlay = blob.url;
          imageGroups[folderName].overlayPath = blob.pathname;
        } else {
          imageGroups[folderName].original = blob.url;
          imageGroups[folderName].originalPath = blob.pathname;
          imageGroups[folderName].filename = filename;
        }
      }
    });

    // Convert to array and filter out incomplete entries
    const reviewedImages = Object.entries(imageGroups)
      .filter(([_, data]) => data.overlay) // Must have at least an overlay
      .map(([folderName, data]) => ({
        folderName,
        ...data
      }))
      .sort((a, b) => a.folderName.localeCompare(b.folderName));

    res.json(reviewedImages);
  } catch (error) {
    console.error('Error listing reviewed images:', error);
    res.status(500).json({ error: 'Failed to read reviewed images from blob storage' });
  }
});

// Export the Express app for Vercel
module.exports = app;
