import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsDir = path.join(__dirname, '../public/images/products');

// Image sizes for different viewports
const sizes = [
  { name: 'thumbnail', width: 200 },
  { name: 'small', width: 400 },
  { name: 'medium', width: 600 },
  { name: 'large', width: 800 },
];

async function getFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFiles(fullPath));
    } else if (entry.name.endsWith('.png')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function getFileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

async function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function optimizeImage(inputPath) {
  const results = {
    original: inputPath,
    originalSize: await getFileSize(inputPath),
    compressedSize: null,
    webpSize: null,
    responsiveSizes: {},
    error: null
  };
  
  try {
    const dir = path.dirname(inputPath);
    const basename = path.basename(inputPath, '.png');
    
    // Get original metadata
    const metadata = await sharp(inputPath).metadata();
    const originalWidth = metadata.width;
    
    // 1. Compress PNG (optimize quality)
    const compressedPath = inputPath; // Overwrite original with optimized version
    await sharp(inputPath)
      .png({ 
        compressionLevel: 9,
        effort: 10,
        quality: 85
      })
      .toFile(compressedPath + '.tmp');
    
    // Only use compressed if smaller
    const tmpSize = await getFileSize(compressedPath + '.tmp');
    if (tmpSize < results.originalSize) {
      await fs.rename(compressedPath + '.tmp', compressedPath);
      results.compressedSize = tmpSize;
    } else {
      await fs.unlink(compressedPath + '.tmp');
      results.compressedSize = results.originalSize;
    }
    
    // 2. Create WebP version
    const webpPath = path.join(dir, `${basename}.webp`);
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);
    results.webpSize = await getFileSize(webpPath);
    
    // 3. Create responsive sizes (both PNG and WebP)
    for (const size of sizes) {
      if (size.width < originalWidth) {
        const sizeDir = path.join(dir, size.name);
        await fs.mkdir(sizeDir, { recursive: true });
        
        // PNG at this size
        const sizedPngPath = path.join(sizeDir, `${basename}.png`);
        await sharp(inputPath)
          .resize(size.width, null, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .png({ compressionLevel: 9, quality: 85 })
          .toFile(sizedPngPath);
        
        // WebP at this size
        const sizedWebpPath = path.join(sizeDir, `${basename}.webp`);
        await sharp(inputPath)
          .resize(size.width, null, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .webp({ quality: 85 })
          .toFile(sizedWebpPath);
        
        results.responsiveSizes[size.name] = {
          png: await getFileSize(sizedPngPath),
          webp: await getFileSize(sizedWebpPath),
          width: size.width
        };
      }
    }
    
  } catch (err) {
    results.error = err.message;
  }
  
  return results;
}

async function main() {
  console.log('Finding PNG images...');
  const files = await getFiles(productsDir);
  console.log(`Found ${files.length} PNG images to optimize\n`);
  
  let totalOriginal = 0;
  let totalCompressed = 0;
  let totalWebp = 0;
  let errors = 0;
  
  const allResults = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relativePath = path.relative(productsDir, file);
    process.stdout.write(`[${i + 1}/${files.length}] Optimizing ${relativePath}... `);
    
    const result = await optimizeImage(file);
    allResults.push(result);
    
    if (result.error) {
      console.log(`ERROR: ${result.error}`);
      errors++;
    } else {
      const savings = ((1 - result.compressedSize / result.originalSize) * 100).toFixed(1);
      const webpSavings = ((1 - result.webpSize / result.originalSize) * 100).toFixed(1);
      console.log(`${formatBytes(result.originalSize)} -> ${formatBytes(result.compressedSize)} (${savings}% saved), WebP: ${formatBytes(result.webpSize)} (${webpSavings}% saved)`);
      
      totalOriginal += result.originalSize;
      totalCompressed += result.compressedSize;
      totalWebp += result.webpSize;
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('OPTIMIZATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total images processed: ${files.length}`);
  console.log(`Errors: ${errors}`);
  console.log('');
  console.log('PNG Compression:');
  console.log(`  Before: ${formatBytes(totalOriginal)}`);
  console.log(`  After:  ${formatBytes(totalCompressed)}`);
  console.log(`  Saved:  ${formatBytes(totalOriginal - totalCompressed)} (${((1 - totalCompressed / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('');
  console.log('WebP Conversion:');
  console.log(`  Total WebP size: ${formatBytes(totalWebp)}`);
  console.log(`  Savings vs original PNG: ${formatBytes(totalOriginal - totalWebp)} (${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('');
  console.log('Responsive sizes created: thumbnail (200px), small (400px), medium (600px), large (800px)');
  console.log('='.repeat(80));
  
  // Write detailed report
  const reportPath = path.join(__dirname, 'optimization-report.json');
  await fs.writeFile(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      totalImages: files.length,
      errors,
      totalOriginal,
      totalCompressed,
      totalWebp,
      pngSavings: totalOriginal - totalCompressed,
      webpSavings: totalOriginal - totalWebp
    },
    results: allResults.map(r => ({
      file: path.relative(productsDir, r.original),
      originalSize: r.originalSize,
      compressedSize: r.compressedSize,
      webpSize: r.webpSize,
      responsiveSizes: r.responsiveSizes,
      error: r.error
    }))
  }, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
}

main().catch(console.error);
