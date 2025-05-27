# 🐐 Capra Contributor Guide
*A community-driven dataset for goat object recognition and behavior labeling.*

## 🧩 Two Ways to Contribute

---

### 1. Capture Contributor (Image Collector)

Help us collect real-world goat images using a simple Raspberry Pi setup or any camera you have access to.

#### 🛠️ What You'll Do
- Run our image capture script
- Filter for relevant images using our lightweight detection model
- Zip and submit your curated images

#### 🪜 Steps
1. **Set up your hardware**
   - Raspberry Pi + camera (recommended models and 3D-printed case options provided)
   - Clone the repo and follow the setup instructions

2. **Run `capture.py`**
   - This saves 1080p images every few seconds

3. **Let it run overnight**
   - Automatically stops at 40 GB of used storage (configurable)

4. **Run `filter.py`**
   - Uses a lightweight object detection model to move images with detected objects to a `filtered/` folder

5. **Optionally review images manually**

6. **Zip your `filtered/` folder**
   - Name your file like: `capra-contrib_username_date.zip`

7. **Submit your contribution**
   - 🔗 Google Drive or Dropbox upload
   - 📝 GitHub Issue with link
   - 🛠️ Pull request to the `contrib/` folder (advanced users)

---

### 2. Label Contributor (Image Annotator)

Help us annotate goat behaviors or positions using masks or bounding boxes.

#### 🛠️ What You'll Do
- Label goat behaviors or body positions using an online or local tool
- Use consistent color codes
- Submit labeled masks back to the project

#### 🪜 Steps
1. **Claim images in the labeling spreadsheet**
   - Add your name/handle and mark the row as "In Progress"

2. **Use the labeling tool**
   - Option 1: Web-based labeler (coming soon)
   - Option 2: Local HTML/JS labeling tool
   - Option 3: GIMP, Krita, or Photoshop

3. **Follow the color class guide**
   - 🟥 Red (#FF0000) = Goat  
   - 🟩 Green (#00FF66) = Trough
   - 🟫 Brown (#8B4513) = Platform/Perch
   - 🟪 Purple (#9370DB) = Enrichment Item

4. **Save as PNG mask**
   - Use the exact same filename as the original image

5. **Submit your labels**
   - ✅ Pull request to `masks/`
   - 🔗 Shared zip via Drive/Dropbox

---

## 💡 Why Contribute?
- Help build the world's most detailed goat behavior dataset
- Get credited in the official contributors list
- Gain early access to trained models
- Support open agriculture and animal health research

---

## 🚀 Get Started
- GitHub: [github.com/capra-ai/goat10k](#)
- Discord: [discord.gg/capra](#)
- Labeling Spreadsheet: [link-to-google-sheet]
- Tools & Docs: See repository README

---
