'use strict';
const sharp = require('sharp');

// Resize an image to preferred size
const resizeImg = async (size, file, thumbname) => {
  console.log('resize', file, thumbname);
  return await sharp(file).resize(size.width, size.height).toFile(thumbname);
};

module.exports = {
  resizeImg
};