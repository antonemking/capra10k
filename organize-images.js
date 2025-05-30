#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Utility script to organize images for Capra10k labeling workflow
 * 
 * Usage:
 *   node organize-images.js flatten    # Move all images to flat structure for easier labeling
 *   node organize-images.js count      # Count images in each directory and show progress
 */

const GOAT_IMAGES_DIR = './goat_images';

function findAllImages(dir, baseDir = dir) {
  const images = [];
  
  if (!fs.existsSync(dir)) {
    return images;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      images.push(...findAllImages(fullPath, baseDir));
    } else if (item.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
      const relativePath = path.relative(baseDir, fullPath);
      images.push({
        original: fullPath,
        relative: relativePath,
        filename: item
      });
    }
  }
  
  return images;
}

function flattenImages() {
  console.log('🔄 Flattening images for labeling...');
  
  const images = findAllImages(GOAT_IMAGES_DIR);
  
  if (images.length === 0) {
    console.log('❌ No images found in goat_images/');
    console.log('💡 Make sure your images are in the goat_images/ directory');
    return;
  }
  
  // Check if images are already flat (no subdirectories with images)
  const hasSubdirectories = images.some(img => img.relative.includes('/') || img.relative.includes('\\'));
  
  if (!hasSubdirectories) {
    console.log('ℹ️  Images are already in flat structure');
    console.log('💡 Ready for labeling! Run: npm start');
    return;
  }
  
  console.log(`📊 Found ${images.length} images in nested structure`);
  console.log('📁 Moving images to flat structure...');
  
  // Create a temporary directory for the flattened images
  const tempDir = './temp_flat';
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir);
  
  // Move images to flat structure
  for (const image of images) {
    // Create unique filename if there are conflicts
    let flatFilename = image.filename;
    let counter = 1;
    
    while (fs.existsSync(path.join(tempDir, flatFilename))) {
      const ext = path.extname(image.filename);
      const base = path.basename(image.filename, ext);
      flatFilename = `${base}_${counter}${ext}`;
      counter++;
    }
    
    // Move file to flat directory
    fs.renameSync(image.original, path.join(tempDir, flatFilename));
    console.log(`📁 ${image.relative} → ${flatFilename}`);
  }
  
  // Clean up empty directories and move flattened images back
  fs.rmSync(GOAT_IMAGES_DIR, { recursive: true, force: true });
  fs.renameSync(tempDir, GOAT_IMAGES_DIR);
  
  console.log(`✅ Flattened ${images.length} images for labeling`);
  console.log('🎯 Ready for labeling! Run: npm start');
}

function countImages() {
  console.log('📊 Image count summary:');
  
  const unlabeled = fs.existsSync(GOAT_IMAGES_DIR)
    ? findAllImages(GOAT_IMAGES_DIR).length
    : 0;
  
  const needReview = fs.existsSync('./goat_images_need_review')
    ? findAllImages('./goat_images_need_review').length
    : 0;
    
  const reviewed = fs.existsSync('./goat_images_reviewed')
    ? findAllImages('./goat_images_reviewed').length
    : 0;
  
  const total = unlabeled + needReview + reviewed;
  
  console.log(`📁 Unlabeled: ${unlabeled}`);
  console.log(`🔍 Need review: ${needReview}`);
  console.log(`✅ Reviewed: ${reviewed}`);
  console.log(`📈 Total processed: ${needReview + reviewed} of ${total} (${total > 0 ? ((needReview + reviewed) / total * 100).toFixed(1) : '0'}%)`);
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'flatten':
    flattenImages();
    break;
  case 'count':
    countImages();
    break;
  default:
    console.log(`
📋 Capra10k Image Organization Tool

Usage:
  node organize-images.js flatten    # Flatten date structure for easier labeling
  node organize-images.js count      # Show image counts and progress

Examples:
  # Prepare date-organized images for labeling
  node organize-images.js flatten
  npm start
  
  # Check labeling progress
  node organize-images.js count
`);
} 