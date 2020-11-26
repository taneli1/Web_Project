'use strict';
const sharp = require('sharp');

const resizeImg = async (size, file, thumbname) => {

  console.log('makeSmaller', file, thumbname);
  return await sharp(file).resize(size.width, size.height).toFile(thumbname);

};

module.exports = {
  resizeImg
};