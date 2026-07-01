const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');

// Create backup of original images
const backupDir = path.join(__dirname, 'images-original');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

console.log('Backing up original images...');
fs.readdirSync(imagesDir).forEach(file => {
  if (file !== '.gitkeep' && !file.startsWith('.')) {
    const srcPath = path.join(imagesDir, file);
    const destPath = path.join(backupDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Backed up: ${file}`);
  }
});

console.log('\nOptimizing images...');

// Optimize each image
const imageFiles = fs.readdirSync(imagesDir).filter(file => 
  file !== '.gitkeep' && 
  !file.startsWith('.') && 
  (file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'))
);

async function optimizeAll() {
  for (const file of imageFiles) {
    try {
      const inputPath = path.join(imagesDir, file);
      const tempPath = path.join(imagesDir, `temp-${file}`);
      const ext = path.extname(file).toLowerCase();
      
      const statsBefore = fs.statSync(inputPath);
      console.log(`\nProcessing ${file}...`);
      console.log(`Before: ${(statsBefore.size / 1024 / 1024).toFixed(2)} MB`);
      
      if (ext === '.png') {
        // Optimize PNG
        await sharp(inputPath)
          .resize(1920, null, { withoutEnlargement: true })
          .png({ quality: 80 })
          .toFile(tempPath);
      } else {
        // Optimize JPEG
        await sharp(inputPath)
          .resize(1920, null, { withoutEnlargement: true })
          .jpeg({ quality: 85, mozjpeg: true })
          .toFile(tempPath);
      }
      
      // Replace original with optimized
      fs.unlinkSync(inputPath);
      fs.renameSync(tempPath, inputPath);
      
      const statsAfter = fs.statSync(inputPath);
      const reduction = 100 - (statsAfter.size / statsBefore.size * 100);
      console.log(`After: ${(statsAfter.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Reduction: ${reduction.toFixed(1)}%`);
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err);
    }
  }
  
  console.log('\nImage optimization complete!');
  console.log('Original images are backed up in images-original/');
}

optimizeAll();
