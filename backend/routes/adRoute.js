'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const adController = require('../controllers/adController');
const passport = require('passport');
const validate = require('../utils/validation');

// Image type check
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.includes('image')) {
    return cb(null, false, new Error('not an image'));
  } else cb(null, true);
};

// Resize all images in the array, current limit 1 image per post
const resizeImages = async (req, res, next) => {
  try {
    for (let i = 0; i < req.files.length; i++) {
      await adController.resize_image(req.files[i], res, next);
      console.log('inside for loop');
    }
  } catch (e) {
    console.log(e);
  }
};

// Image(s) upload destination
const upload = multer({dest: './public/images/', fileFilter});

// Specify ad type (buy/sell) and fetch all of them
router.get('/:ad_type',
    validate.paramType,
    adController.ad_get_list);

// Get single ad with its id
router.get('/id/:id',
    validate.paramId,
    adController.ad_get_by_id);

// Get all of single user's ads
router.get('/user/:id',
    validate.paramId,
    adController.ad_get_user_ads);

// Get all possible categories for frontend
router.get('/category/get', adController.ad_get_categories);
// Get all ads of specified type (buy/sell) from a category
router.get('/category/:ad_type/:category',
    validate.paramType,
    validate.paramCategory,
    adController.ad_get_by_category);

// Search for results in database with keyword(s), type and category (optional)
router.get('/search/:ad_type/:keywords/:category',
    validate.paramType,
    validate.paramKeyword,
    validate.paramCategory,
    adController.ad_search_keywords);

// Post an ad, route needs user to be logged in, create thumbnail(s)
router.post('/',
    passport.authenticate('jwt', {session: false}),
    upload.array('image', 1),
    resizeImages,
    validate.adPost,
    adController.ad_post);

// Delete an ad, route needs user to be logged in
router.delete('/:ad_id',
    passport.authenticate('jwt', {session: false}),
    validate.paramId,
    adController.ad_delete_by_id);

module.exports = router;