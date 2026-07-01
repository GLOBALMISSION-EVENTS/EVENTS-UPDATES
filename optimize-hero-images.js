const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const files = ['hero-mission-globe.jpg', 'hero-worship-service.jpg', 'hero-humanitarian-work.jpg'];

async function optimize() {
  for (let file of files) {
    const inputPath = path.join(__dirname, 'images', file);
    const tempPath = path.join(__dirname, 'images', 'temp-' + file);
    
    console.log(`Optimizing ${file}...`);
    
    await sharp(inputPath)
      .resize(1920, 1080, {
        fit: 'cover',
        position: 'attention'
      })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(tempPath);
      
    const stats = fs.statSync(tempPath);
    console.log(`Finished ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
    
    // Replace original
    fs.unlinkSync(inputPath);
    fs.renameSync(tempPath, inputPath);
  }
}

optimize().catch(console.error);
