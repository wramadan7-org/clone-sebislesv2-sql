const sharp = require('sharp');
const fs = require('fs');
const ext = require('path');

const resizing = async (path, width, height, quality, destination) => {
  try {
    const filePath = ext.extname(path);

    if (filePath == '.pdf') {
      return true;
    }

    await sharp(path)
      .resize(width, height)
      .jpeg({ quality })
      .png()
      .toFile(destination);

    fs.unlinkSync(path);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = resizing;
