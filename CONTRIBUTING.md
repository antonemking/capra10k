# Contributing to Capra10k

Thank you for your interest in contributing to the Capra10k goat detection dataset! This guide explains how you can help label goat images while handling the large file sizes properly.

## 🎯 Project Overview

Capra10k is building a comprehensive dataset for goat detection and behavior analysis in agricultural settings. We're looking for contributors to help label images with:
- **Goats** (individual animals)
- **Troughs** (feeding areas)
- **Platforms** (elevated structures/perches)
- **Enrichment Items** (toys, structures for play)

## 📁 Repository Structure

```
capra10k/
├── index.html          # Main labeling interface
├── server.js           # Backend server
├── package.json        # Dependencies
├── sample_images/      # Small sample images for testing
├── CONTRIBUTING.md     # This file
└── README.md          # Project documentation
```

**Note:** Image directories (`goat_images/`, `goat_images_need_review/`, etc.) are excluded from Git due to large file sizes.

## 🚀 Getting Started

### 1. Fork and Clone
```bash
git clone https://github.com/yourusername/capra10k.git
cd capra10k
npm install
```

### 2. Get Images to Label

#### Option A: Use Sample Images (Recommended for Testing)
```bash
# Sample images are included in the repo
mkdir -p goat_images
# Copy sample images to goat_images/ for testing
```

#### Option B: Download Full Dataset
```bash
# Download from our S3 bucket (instructions will be provided)
aws s3 sync s3://capra10k-dataset/unlabeled/ goat_images/
```

#### Option C: Use Your Own Images
You can organize images in two ways:

**Flat Structure (for labeling):**
```
goat_images/
├── image1.jpg
├── image2.jpg
└── image3.jpg
```

**Date-based Structure (for daily capture organization):**
```
goat_images/
├── 2025/
│   ├── 01/
│   │   ├── 15/
│   │   │   ├── frame_001.jpg
│   │   │   └── frame_002.jpg
│   │   └── 16/
│   │       └── frame_003.jpg
│   └── 05/
│       └── 25/
│           ├── frame_004.jpg
│           └── frame_005.jpg
```

**Organization Utility:**
If you have date-organized images, use our utility script:
```bash
# Flatten structure for easier labeling
node organize-images.js flatten

# Label your images...
npm start

# Restore date structure when done
node organize-images.js restore

# Check progress anytime
node organize-images.js count
```

### 3. Start Labeling
```bash
npm start
# Open http://localhost:3000 in your browser
```

## 🏷️ Labeling Guidelines

### Annotation Standards
- **Goats**: Draw polygons around individual goat bodies (include head, body, legs)
- **Troughs**: Mark feeding areas and water containers
- **Platforms**: Include ramps, elevated sleeping areas, climbing structures
- **Enrichment**: Toys, balls, objects for goat enrichment

### Quality Standards
- **Precise boundaries**: Polygons should closely follow object edges
- **Complete coverage**: Don't miss partially visible objects
- **Consistent categories**: Use the same category for similar objects
- **Minimum size**: Only label objects that are clearly identifiable

### Keyboard Shortcuts
- `1-4`: Quick category selection
- `←/→`: Navigate between images
- `Ctrl+S`: Save and move to next
- `Space`: Skip image
- `Esc`: Reset current annotations

## 📤 Contributing Your Work

### Method 1: Local Contribution (Small Datasets)
1. Label images using the tool
2. Completed images and overlays go to `goat_images_need_review/`
3. Create a pull request with your labeled data

### Method 2: Cloud Contribution (Large Datasets)
1. Label images locally
2. Upload completed work to designated S3 bucket:
   ```bash
   aws s3 sync goat_images_need_review/ s3://capra10k-contributions/your-username/
   ```
3. Submit a pull request with metadata about your contribution:
   ```json
   {
     "contributor": "your-username",
     "images_labeled": 150,
     "date": "2025-01-XX",
     "s3_path": "s3://capra10k-contributions/your-username/",
     "categories": ["goat", "trough", "platform", "enrichment"]
   }
   ```

### Method 3: Annotation-Only Contribution
- Submit just the annotation files (masks, polygons) without images
- Include a mapping file linking annotations to original image filenames
- Much smaller file sizes, easier to manage in Git

## 🔧 Development Setup

### Adding New Features
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test with sample images
5. Submit a pull request

### Testing Your Changes
```bash
# Use sample images for testing
cp sample_images/* goat_images/25/
npm start
```

## 📋 Contribution Checklist

- [ ] Images are properly categorized and labeled
- [ ] Annotations follow quality standards
- [ ] No large image files committed to Git
- [ ] Pull request includes contribution metadata
- [ ] Local testing completed successfully

## 🤝 Community

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join our GitHub Discussions for questions
- **Discord**: [Link to community Discord]

## 📊 Dataset Statistics

- **Target**: 10,000+ labeled images
- **Current**: [Updated automatically]
- **Contributors**: [Updated automatically]
- **Categories**: 4 (Goat, Trough, Platform, Enrichment)

## 🏆 Recognition

Contributors will be acknowledged in:
- Repository contributors list
- Dataset publication acknowledgments
- Community hall of fame

Thank you for helping build the future of agricultural AI! 🐐🤖 