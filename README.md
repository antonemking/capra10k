# Capra10k - Goat Detection Dataset & Labeling Tool 🐐

A comprehensive tool for creating labeled datasets of goat behavior and detection in agricultural environments. Built by **Capra AI** for advancing computer vision in livestock management.

## 🎯 Project Overview

Capra10k aims to create a large-scale, high-quality dataset for:
- **Goat Detection**: Individual animal identification and tracking
- **Behavior Analysis**: Understanding goat interactions with environment
- **Agricultural AI**: Supporting smart farming and livestock management
- **Research**: Enabling academic and commercial research in animal AI

## ✨ Features

- **Interactive Polygon Labeling**: Precise annotation tool for complex shapes
- **Multi-Category Support**: Goats, troughs, platforms, and enrichment items
- **Batch Processing**: Navigate through large image datasets efficiently
- **Keyboard Shortcuts**: Speed up annotation workflow
- **Quality Control**: Built-in review system for label validation
- **Export Capabilities**: Generate masks and overlays for training

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- Modern web browser
- Images to label (or use our sample dataset)

### Installation
```bash
git clone https://github.com/yourusername/capra10k.git
cd capra10k
npm install
npm start
```

Open `http://localhost:3000` and start labeling!

### For Contributors
See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions on:
- Getting image datasets
- Labeling guidelines
- Contributing your work
- Handling large files

## 🌐 Deployment (Vercel)

### Prerequisites
1. A [Vercel account](https://vercel.com) (free tier works great!)
2. Vercel Blob Storage connected to your project

### Deployment Steps

1. **Install Vercel CLI** (optional, for local testing):
   ```bash
   npm install -g vercel
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Import your repository (`antonemking/capra10k`)
   - Configure the project with these settings:
     - **Framework Preset**: `Other`
     - **Root Directory**: `./` (or leave blank)
     - **Build Command**: Leave empty
     - **Install Command**: `npm install`
     - **Output Directory**: Leave empty

3. **Set up Vercel Blob Storage**:
   - In your Vercel project dashboard, go to **Storage**
   - Add **Blob Storage**
   - Copy the `BLOB_READ_WRITE_TOKEN` environment variable (this is automatically added to your project)

4. **Upload Images to Blob Storage**:
   - Images should be stored with the prefix `goat_images/`
   - You can upload images via:
     - Vercel Dashboard UI
     - Vercel CLI: `vercel blob upload <file> --token <your-token>`
     - Custom upload script using the `@vercel/blob` SDK

5. **Deploy**:
   ```bash
   vercel deploy --prod
   ```

### Environment Variables
The following environment variable is required and automatically configured when you add Blob Storage:
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob Storage access token

### Image Upload Example
```javascript
// Upload script example (Node.js)
const { put } = require('@vercel/blob');

async function uploadImage(filePath) {
  const fileBuffer = require('fs').readFileSync(filePath);
  const blob = await put(`goat_images/${path.basename(filePath)}`, fileBuffer, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  console.log('Uploaded:', blob.url);
}
```

### Important Notes
- **Blob Storage Structure**:
  - `goat_images/` - Source images to label
  - `goat_images_need_review/` - Completed annotations
  - `goat_images_reviewed/` - Final approved labels
- All images are stored in Vercel Blob Storage with public URLs
- The frontend automatically loads images from blob URLs
- Annotations are saved directly to blob storage

## 🏷️ Annotation Categories

| Category | Description | Color |
|----------|-------------|-------|
| 🐐 **Goat** | Individual goat bodies | Red |
| 🍽️ **Trough** | Feeding and water areas | Green |
| 🪜 **Platform** | Elevated structures, ramps | Brown |
| 🎾 **Enrichment** | Toys, play objects | Purple |

## 🎮 Controls & Shortcuts

### Mouse Controls
- **Click**: Place annotation points
- **Click near start**: Close polygon
- **Drag points**: Adjust polygon shape
- **Right-click point**: Delete point
- **Scroll**: Zoom in/out

### Keyboard Shortcuts
- `←/→`: Navigate between images
- `1-4`: Quick category selection
- `Ctrl+S`: Save & move to next
- `Space`: Skip current image
- `Esc`: Reset annotations
- `Z/Y`: Undo/Redo points

## 📁 File Structure

```
capra10k/
├── index.html              # Main labeling interface
├── server.js               # Express server
├── package.json            # Dependencies
├── organize-images.js      # Utility for managing image structures
├── sample_images/          # Small test images
├── CONTRIBUTING.md         # Contributor guide
└── README.md              # This file

# Created during use (excluded from Git):
├── goat_images/           # Source images to label
│   └── 2025/05/25/       # Optional: date-organized structure
├── goat_images_need_review/  # Completed work for review
└── goat_images_reviewed/  # Final approved dataset
```

### Image Organization
The tool supports both flat and date-organized directory structures:

```bash
# For date-organized images, flatten for labeling
node organize-images.js flatten
npm start

# Restore original structure when done
node organize-images.js restore
```

## 🤝 Contributing

We welcome contributions! The project handles large image files through:

1. **Git exclusion**: Images are not stored in the repository
2. **S3 distribution**: Large datasets available via cloud storage
3. **Flexible workflow**: Multiple contribution methods for different scales

See [CONTRIBUTING.md](CONTRIBUTING.md) for complete details.

## 📊 Dataset Progress

- 🎯 **Target**: 10,000+ labeled images
- 📈 **Current**: [Auto-updated]
- 👥 **Contributors**: [Community count]
- 🏷️ **Categories**: 4 annotation types

## 🛠️ Technical Details

### Built With
- **Frontend**: Vanilla JavaScript + Konva.js for canvas manipulation
- **Backend**: Node.js + Express for file handling
- **Storage**: Vercel Blob Storage for cloud deployment, Local filesystem for development

### API Endpoints
- `GET /api/images` - List available images (returns array of `{filename, url}`)
- `POST /api/save-overlay` - Save annotated overlay to blob storage
- `POST /api/move-to-reviewed` - Move image to review queue in blob storage

## 📜 License

[Your chosen license here]

## 🏆 Acknowledgments

- Contributors to the dataset
- Agricultural research community
- Open source computer vision tools

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/capra10k/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/capra10k/discussions)
- **Email**: contact@capra-ai.com

---

**Built with ❤️ by Capra AI for the future of agricultural technology**
