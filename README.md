# Global Mission For Christ International Events Platform

A beautiful, responsive website for showcasing GMCI events with a user-friendly drag-and-drop CMS.

## Features

✨ **Beautiful Design** - Visually compelling UI with professional styling
📅 **Events Showcase** - Display upcoming and recent events
📝 **Drag-and-Drop CMS** - Easy event management for non-technical users
💾 **Local Storage** - Auto-saves changes locally
📤 **Import/Export** - Backup and restore event data
📱 **Responsive** - Works perfectly on all devices
🌐 **GitHub Pages Ready** - Easy deployment
🖼️ **Zero-Cost Image Hosting** - Host images directly on GitHub

## Project Structure

```
GMCI/
├── index.html      # Main HTML file
├── styles.css      # Stylesheet
├── app.js          # JavaScript logic
├── images/         # 🖼️ Put your poster images here
├── package.json    # Project configuration
└── README.md       # This file
```

## How to Add Your Poster Images (Zero Cost!)

1. Copy your local poster images into the `images/` folder
2. Rename your images to match these filenames (or edit the event in the CMS to use your filenames):
   - `breakfast-poster.jpg` - Mission Impact Breakfast
   - `conference-poster.jpg` - 5th Annual Mega Conference
   - `kiamariga-camp.jpg` - Kiamariga Medical Camp
3. Commit and push your changes to GitHub
4. Go to the **CMS Admin** section and click **🔄 Reset to Default** to load the new images

## How to Deploy to GitHub Pages

### 1. Create a GitHub Repository
- Go to https://github.com/new
- Create a new repository (name it whatever you like)
- Initialize with a README (optional)

### 2. Push your code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 3. Enable GitHub Pages
- Go to your repository on GitHub
- Click **Settings** → **Pages**
- Under "Source", select **Deploy from a branch**
- Select **main** branch and **/ (root)** folder
- Click **Save**

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## How to Use the CMS

1. Go to the **CMS Admin** section of the website
2. Click **+ Add New Event** to create a new event
3. Drag and drop events to reorder them
4. Click ✏️ to edit an event
5. Click 🗑️ to delete an event
6. Click 💾 Save Changes to ensure data is stored
7. Use 📤 Export and 📥 Import for backup/restore
8. Use 🔄 Reset to Default to restore original events

## QR Code for the Website

Generate a QR code linking to your GitHub Pages URL using any QR code generator, or use this as a placeholder!

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- SortableJS (for drag-and-drop)
- Google Fonts

## License

MIT
