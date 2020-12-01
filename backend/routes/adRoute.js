'use strict';
// TODO Image uploads, Validation

const express = require('express');
const router = express.Router();
const multer = require('multer');
const adController = require('../controllers/adController');
const passport = require('passport');
const {body} = require('express-validator');

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.includes('image')) {
    return cb(null, false, new Error('not an image'));
  }
  else cb(null,true)
};

const injectFile = (req, res, next) => {
  if (req.file) {
    req.body.type = req.file.mimetype;
  }
  next();
};

const upload = multer({dest: './uploads/', fileFilter});

// Get all user's ads from this route
router.get('/user/:userId', adController.ad_get_user_ads);

// Get all ads of specified type
router.get('/:ad_type', adController.ad_get_list);
// Get single ad of specified type with its id
router.get('/:ad_type/:id', adController.ad_get_by_id);

// Post an ad, route needs user to be logged in
router.post('/:ad_type',
    passport.authenticate('jwt', {session: false}),
    injectFile,
    upload.single('image'),
    //adController.resize_image,
    [
      body('item_name', 'min length 3 chars').isLength({min: 3}),
      body('city', 'min length 3 chars').isLength({min: 3}),
      body('price', 'must be a number').isLength({min: 1}).isNumeric(),
      body('description', 'min length 3 chars').isLength({min: 3}),
      body('type', 'file req').contains('image'),
    ],
    adController.ad_post);

// Delete an ad, route needs user to be logged in
router.delete('/:ad_type/:id',
    passport.authenticate('jwt', {session: false}),
    adController.ad_delete_by_id);

module.exports = router;