const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '../public/logo-transparent.png');
const outputDir = path.join(__dirname, '../public');

const sizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' }
];

async function generateIcons() {
  console.log('Reading logo from:', logoPath);
  
  if (!fs.existsSync(logoPath)) {
    console.error('Logo file not found!');
    return;
  }

  for (const { size, name } of sizes) {
    const outputPath = path.join(outputDir, name);
    
    try {
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 37, g: 99, b: 235, alpha: 1 } // Blue background #2563eb
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`✗ Failed to generate ${name}:`, error.message);
    }
  }

  console.log('\n✓ All icons generated successfully!');
}

generateIcons();
