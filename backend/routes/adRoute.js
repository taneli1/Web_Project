'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const adController = require('../controllers/adController');
const passport = require('passport');
const validate = require('../utils/validation')

// Image check
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.includes('image')) {
        return cb(null, false, new Error('not an image'));
    } else cb(null, true)
};

const resizeImages = async (req, res, next) => {
  try {
    for (let i = 0; i < req.files.length; i++) {
      await adController.resize_image(req.files[i],res,next)
      console.log("inside for loop")
    }
  }
  catch (e) {
    console.log(e)
  }
}

// Where to upload image(s)
const upload = multer({dest: './ads/images/', fileFilter});

// Get all ads of specified type
router.get('/:ad_type',
    validate.paramType,
    adController.ad_get_list);

// Get single ad with its id
router.get('/id/:id',
    validate.paramId,
    adController.ad_get_by_id);

// Get all of user's ads
router.get('/user/:id',
    validate.paramId,
    adController.ad_get_user_ads);

// Get all categories for frontend
router.get('/category/get', adController.ad_get_categories)
// Get results with the category of ads
router.get('/category/:ad_type/:category',
    validate.paramType,
    validate.paramCategory,
    adController.ad_get_by_category);

// Search for results in database with keyword(s)
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