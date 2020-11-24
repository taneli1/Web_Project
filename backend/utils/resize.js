'use strict';
const sharp = require('sharp');

const makeThumbnail = async (size, file, thumbname) => {

  console.log('makeThumbnail', file, thumbname);
  return await sharp(file).resize(size.width, size.height).toFile(thumbname);

};

module.exports = {
  makeThumbnail,
};