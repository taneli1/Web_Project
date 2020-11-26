'use strict';

const {validationResult} = require('express-validator');

const TAG = 'adController: ';
const adModel = require('../models/adModel');
const {resizeImg} = require('../utils/resize');

/**
 * Responds with ads of requested type from database
 * !!! needs ad_type in req.body. Default: sell
 * TODO Get certain amount of ads (range, first 50, 50-100...)
 */
const ad_get_list = async (req, res) => {
  const ads = await adModel.getAllAds(req);
  res.json(ads);
};

/**
 * Save an ad into database, req needs to include a sell or buy option
 * defaults to sell
 * !!! needs ad_type in req.body. Default: sell
 * TODO VALIDATION IN ROUTE
 */
const ad_post = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('validation', errors.array());
    return res.status(400).json({errors: errors.array()});
  }

  console.log(req.body)
  const adOk = await adModel.postAd(req);
  res.json(adOk);
};

/**
 * Get a single ad with ad_id
 * !!! needs ad_type in req.body. Default: sell
 */
const ad_get_by_id = async (req, res) => {
  const ad = await adModel.getAdById(req);
  res.json(ad);
};

/**
 * Delete an ad
 */
const ad_delete_by_id = async (req,res ) => {
  const deleteCompleted = await adModel.deleteAdById(req);
  res.json(deleteCompleted);
}

/**
 * Resize an image
 */
const resize_image = async (req, res, next) => {
  try {
    const ready = await resizeImg({width: 160, height: 160}, req.file.path,
        './backend/imgcache' + req.file.filename);
    if (ready) {
      console.log(TAG, "Resize", ready);
      next();
    }
  } catch (e) {
    console.log(TAG , e)
    next();
  }
}


module.exports = {
  ad_get_list,
  ad_get_by_id,
  ad_post,
  ad_delete_by_id,
  resize_image
};
