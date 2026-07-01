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

## Project Structure

```
GMCI/
├── index.html      # Main HTML file
├── styles.css      # Stylesheet
├── app.js          # JavaScript logic
├── package.json    # Project configuration
└── README.md       # This file
```

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
