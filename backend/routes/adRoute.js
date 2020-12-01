'use strict';
// TODO Image uploads, Validation

const express = require('express');
const router = express.Router();
const multer = require('multer');
const adController = require('../controllers/adController');
const passport = require('passport');
const {body} = require('express-validator');

const fileFilter = (req, files, cb) => {
  if (!files.mimetype.includes('image')) {
    return cb(null, false, new Error('not an image'));
  }
  else cb(null,true)
};
const injectFile = (req, res, next) => {
  if (req.files) {
    req.body.type = req.files.mimetype;
  }
  next();
};

const upload = multer({dest: './uploads/', fileFilter});

// Both of these requests need a specifying parameter to decide which
// type of ads we want to fetch = req.body.ad_type
router.get('/:ad_type', adController.ad_get_list);
router.get('/:ad_type/:id', adController.ad_get_by_id);

// Route needs user to be logged in
router.post('/:ad_type',
    passport.authenticate('jwt', {session: false}),
    injectFile,
    upload.single('image'),
    //upload.array('image',5),
    //adController.resize_image,
    [
      body('item_name', 'min length 3 chars').isLength({min: 3}),
      body('city', 'min length 3 chars').isLength({min: 3}),
      body('price', 'must be a number').isLength({min: 1}).isNumeric(),
      body('description', 'min length 3 chars').isLength({min: 3}),
      body('type', 'file req').contains('image'),
    ],
    adController.ad_post);

router.delete('/:ad_type/:id', adController.ad_delete_by_id);

module.exports = router;