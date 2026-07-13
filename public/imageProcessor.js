const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

// =====================
// Remove metadata
// =====================
async function removeMetadata(inputPath) {
  try {
    // Sharp 默认不会保留元数据
    return sharp(inputPath);
  } catch (error) {
    console.error("Remove metadata failed:", error);
    throw error;
  }
}

// =====================
// Convert image format
// =====================
async function convertFormat(image, format = "jpg") {
  switch (format.toLowerCase()) {
    case "jpg":
    case "jpeg":
      return image.jpeg({
        quality: 95,
        mozjpeg: true,
      });

    case "png":
      return image.png({
        compressionLevel: 9,
      });

    case "webp":
      return image.webp({
        quality: 95,
      });

    case "gif":
      return image.gif();

    case "bmp":
      return image.bmp();

    case "tiff":
      return image.tiff({
        quality: 95,
      });

    case "avif":
      return image.avif({
        quality: 80,
      });

    default:
      return image.jpeg({
        quality: 95,
        mozjpeg: true,
      });
  }
}

// =====================
// Apply adjustments
// =====================
async function applyAdjustments(image, options = {}) {

  if (
    options.resize &&
    options.resize.width &&
    options.resize.height
  ) {
    image = image.resize(
      options.resize.width,
      options.resize.height,
      {
        fit: "cover",
      }
    );
  }

  if (
    options.crop &&
    options.crop.width &&
    options.crop.height
  ) {
    image = image.extract({
      left: options.crop.left || 0,
      top: options.crop.top || 0,
      width: options.crop.width,
      height: options.crop.height,
    });
  }

  if (options.brightness) {
    image = image.modulate({
      brightness: 1 + options.brightness / 100,
    });
  }

  if (options.contrast) {
    image = image.modulate({
      saturation: 1 + options.contrast / 100,
    });
  }

  return image;
}

// =====================
// Main process
// =====================
async function processImages(files = [], options = {}) {

  const results = [];

  const outputDir =
    options.outputDirectory ||
    path.join(process.cwd(), "processed-images");

  await fs.mkdir(outputDir, {
    recursive: true,
  });

  for (const file of files) {

    try {

      const ext =
        (options.format || "jpg").toLowerCase();

      const basename =
        path.parse(file).name;

      const outputPath =
        path.join(
          outputDir,
          `${basename}-processed.${ext}`
        );

      let image = sharp(file);

      // 默认去除元数据
      if (!options.removeMetadata) {
        image = image.withMetadata();
      }

      image =
        await applyAdjustments(
          image,
          options.adjustments
        );

      image =
        await convertFormat(
          image,
          ext
        );

      await image.toFile(outputPath);

      results.push({
        inputFile: file,
        outputFile: outputPath,
        success: true,
        message: "Processed successfully",
      });

    } catch (error) {

      console.error(error);

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
