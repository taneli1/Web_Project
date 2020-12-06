'use strict';
// TODO Image uploads, Validation

const express = require('express');
const router = express.Router();
const multer = require('multer');
const adController = require('../controllers/adController');
const passport = require('passport');
const {body} = require('express-validator');

// Image check
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.includes('image')) {
        return cb(null, false, new Error('not an image'));
    } else cb(null, true)
};

const resizeImages = async (req, res, next) => {
    console.log("Resize")
    console.log(req.files.length)
    for (let i = 0; i < req.files.length; i++) {
        await adController.resize_image(req.files[i],res,next)
        console.log("inside for loop")
    }
    next()
}
// Where to upload images
const upload = multer({dest: './ads/images/', fileFilter});

// Get all ads of specified type
router.get('/:ad_type', adController.ad_get_list);

// Get single ad with its id
router.get('/id/:id', adController.ad_get_by_id);

// Get all of user's ads
router.get('/user/:user_id', adController.ad_get_user_ads);

// Get all categories for frontend
router.get('/category/get', adController.ad_get_categories)
// Get results with the category of ads
router.get('/category/:ad_type/:ctg', adController.ad_get_by_category);

// Search for results in database with keyword(s)
router.get('/search/:ad_type/:keywords', adController.ad_search_keywords);


// Post an ad, route needs user to be logged in, create thumbnails
router.post('/',
    passport.authenticate('jwt', {session: false}),
    upload.array('image', 1),
    resizeImages,
    [
        body('item_name', 'min length 3 chars').isLength({min: 3}),
        body('city', 'min length 3 chars').isLength({min: 3}),
        body('price', 'must be a number').isLength({min: 1}).isNumeric(),
        body('description', 'min length 3 chars').isLength({min: 3}),
    ],
    adController.ad_post);

// Delete an ad, route needs user to be logged in
router.delete('/:ad_id',
    passport.authenticate('jwt', {session: false}),
    adController.ad_delete_by_id);

module.exports = router;