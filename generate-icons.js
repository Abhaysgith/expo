/**
 * Run this ONCE after npm install to generate PNG icons from the SVG.
 * Requires: npm install sharp -D
 *
 * Usage: node generate-icons.js
 *
 * If you don't want to install sharp, you can:
 * 1. Open public/icons/icon.svg in a browser
 * 2. Screenshot and resize to 192x192 and 512x512
 * 3. Save as icon-192.png and icon-512.png in public/icons/
 */

const fs = require('fs');
const path = require('path');

// Inline SVG as a buffer — creates minimal valid PNG placeholders
// Replace with real sharp conversion if desired

const { execSync } = require('child_process');

try {
  execSync('node -e "require(\'sharp\')"', { stdio: 'pipe' });

  const sharp = require('sharp');
  const svgPath = path.join(__dirname, 'public/icons/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  sharp(svgBuffer).resize(192, 192).png().toFile(
    path.join(__dirname, 'public/icons/icon-192.png'),
    () => console.log('✓ icon-192.png generated')
  );
  sharp(svgBuffer).resize(512, 512).png().toFile(
    path.join(__dirname, 'public/icons/icon-512.png'),
    () => console.log('✓ icon-512.png generated')
  );
} catch {
  // sharp not available — create minimal 1x1 PNG placeholders so the app doesn't crash
  // Real icons should be added before production
  const MINIMAL_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  fs.writeFileSync(path.join(__dirname, 'public/icons/icon-192.png'), MINIMAL_PNG);
  fs.writeFileSync(path.join(__dirname, 'public/icons/icon-512.png'), MINIMAL_PNG);
  console.log('⚠ sharp not found. Minimal placeholder PNGs created.');
  console.log('  For real icons: npm install sharp -D && node generate-icons.js');
}
