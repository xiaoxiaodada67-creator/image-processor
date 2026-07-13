const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const ExifParser = require('exifparser');

// Remove metadata from image
async function removeMetadata(inputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Create new image without metadata
    let processed = sharp(inputPath).withMetadata(false);
    
    return processed;
  } catch (error) {
    console.error('Error removing metadata:', error);
    throw error;
  }
}

// Convert image format
async function convertFormat(inputImage, format) {
  const formatMap = {
    jpg: 'jpeg',
    jpeg: 'jpeg',
    png: 'png',
    webp: 'webp',
    gif: 'gif',
    bmp: 'bmp',
  };

  const targetFormat = formatMap[format.toLowerCase()] || 'jpeg';
  return inputImage.toFormat(targetFormat);
}

// Apply image adjustments
async function applyAdjustments(inputImage, options) {
  let image = inputImage;

  // Resize
  if (options.resize && options.resize.width && options.resize.height) {
    image = image.resize(options.resize.width, options.resize.height, {
      fit: 'cover',
    });
  }

  // Crop
  if (options.crop && options.crop.width && options.crop.height) {
    image = image.extract({
      left: options.crop.left || 0,
      top: options.crop.top || 0,
      width: options.crop.width,
      height: options.crop.height,
    });
  }

  // Brightness
  if (options.brightness && options.brightness !== 0) {
    image = image.modulate({ brightness: 1 + options.brightness / 100 });
  }

  // Contrast
  if (options.contrast && options.contrast !== 0) {
    image = image.modulate({ saturation: 1 + options.contrast / 100 });
  }

  return image;
}

// Main processing function
async function processImages(files, options) {
  const results = [];
  const outputDir = options.outputDirectory || './processed-images';

  // Create output directory if it doesn't exist
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    console.error('Error creating output directory:', error);
  }

  for (const file of files) {
    try {
      const filename = path.basename(file);
      const nameWithoutExt = path.parse(filename).name;
      const outputFormat = options.format || 'jpg';
      const outputFilename = `${nameWithoutExt}-processed.${outputFormat}`;
      const outputPath = path.join(outputDir, outputFilename);

      // Start with image
      let image = sharp(file);

      // Remove metadata
      if (options.removeMetadata) {
        image = image.withMetadata(false);
      }

      // Apply adjustments
      if (options.adjustments) {
        image = await applyAdjustments(image, options.adjustments);
      }

      // Convert format
      image = await convertFormat(image, outputFormat);

      // Save processed image
      await image.toFile(outputPath);

      results.push({
        inputFile: file,
        outputFile: outputPath,
        success: true,
        message: 'Processed successfully',
      });
    } catch (error) {
      results.push({
        inputFile: file,
        success: false,
        message: error.message,
      });
    }
  }

  return results;
}

module.exports = {
  processImages,
  removeMetadata,
  convertFormat,
  applyAdjustments,
};
