# Image Processor

A desktop application for batch image processing with metadata removal, format conversion, and image editing capabilities.

## Features

- ✅ **Batch Processing** - Process multiple images at once with one click
- ✅ **Metadata Removal** - Remove EXIF, IPTC, and XMP metadata from images
- ✅ **Format Conversion** - Convert between JPG, PNG, WebP, GIF, and BMP formats
- ✅ **Image Editing** - Adjust brightness and contrast
- ✅ **Privacy Focused** - All processing happens locally on your computer
- ✅ **Windows Installer** - Easy installation with NSIS installer

## System Requirements

- Windows 7 or later
- 100 MB free disk space
- No internet connection required

## Installation

1. Download the latest installer from the [releases page](https://github.com/xiaoxiaodada67-creator/image-processor/releases)
2. Run the installer and follow the on-screen instructions
3. Launch Image Processor from your Start Menu or Desktop shortcut

## Usage

### Basic Workflow

1. **Select Images** - Click "Select Images" to choose one or more image files
2. **Choose Output Location** - Select where to save the processed images
3. **Configure Settings**:
   - Choose output format (JPG, PNG, WebP, etc.)
   - Enable/disable metadata removal
   - Adjust brightness and contrast as needed
4. **Process** - Click the "Process All Images" button to process all selected images at once

### Detailed Settings

#### Metadata Removal
- **Enabled by default** - Removes all EXIF, IPTC, and XMP metadata
- Useful for privacy protection when sharing images

#### Output Format
- **JPG** - Compressed format, good for photos
- **PNG** - Lossless format, good for graphics
- **WebP** - Modern compressed format
- **GIF** - Animated format support
- **BMP** - Uncompressed format

#### Brightness & Contrast
- **Brightness**: Adjust from -50% to +50%
- **Contrast**: Adjust from -50% to +50%
- Use the sliders to fine-tune image appearance

## Building from Source

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development mode
npm start

# Build for Windows
npm run build

# Create installer
npm run electron-build
```

### Development

```bash
# Start Electron and React dev servers
npm start

# The app will open with hot reload enabled
```

## Output

Processed images are saved with `-processed` suffix in the selected output directory.

Example:
- Input: `photo.jpg`
- Output: `photo-processed.jpg`

## Privacy

All image processing happens locally on your computer. No files are uploaded to any server.

## License

MIT

## Support

For issues, feature requests, or questions, please open an issue on GitHub.

## Troubleshooting

### App won't start
- Try uninstalling and reinstalling the application
- Make sure you have administrator privileges
- Check that you have at least 100 MB free disk space

### Processing fails
- Ensure the output directory is writable
- Check that you have enough disk space for the output files
- Try with smaller images first

### Metadata still present
- Some image formats may not support metadata removal
- Try converting to JPG or PNG format
