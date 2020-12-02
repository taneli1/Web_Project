'use strict';
const {validationResult} = require('express-validator');
const TAG = 'adController: ';
const adModel = require('../models/adModel');
const {resizeImg} = require('../utils/resize');

/*
  Gets data from adModel to respond to different requests from adRoute.
 */

/**
 * Responds with ads of requested type from database
 * TODO Get certain amount of ads (range, first 50, 50-100...)
 */
const ad_get_list = async (req, res) => {
  const ads = await adModel.getAllAds(req);
  res.json(ads);
};

/**
 * Save an ad into database
 */
const ad_post = async (req, res) => {

  // Check for validation errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('validation', errors.array());
    return res.status(400).json({errors: errors.array()});
  }

  // Return the res from postAd
  const ok = await adModel.postAd(req);
  res.json(ok);
};

/**
 * Get a single ad with ad_id
 */
const ad_get_by_id = async (req, res) => {

  const ad = await adModel.getAdById(req);
  res.json(ad);
};

/**
 * Search for ads in db
 */
const ad_search_keywords = async (req,res) => {
  const results = await adModel.searchAd(req);
  res.json(results);
}

/**
 * Get all ads from a user
 */
const ad_get_user_ads = async (req, res) => {
  const userAds = await adModel.getAllUserAds(req);
  res.json(userAds);
};

/**
 * Delete an ad
 */
const ad_delete_by_id = async (req, res) => {
  const deletion = await adModel.deleteAdById(req);
  res.json(deletion);
};

/**
 * Resize an image
 */
const resize_image = async (req, res, next) => {
  try {
    const ready = await resizeImg({width: 160, height: 160}, req.file.path,
        './ads/thumbnails/' + req.file.filename);
    if (ready) {
      console.log(TAG, 'Resize', ready);
      next();
    }
  }
  catch (e) {
    console.log(TAG, e);
    next();
  }
};

module.exports = {
  ad_get_list,
  ad_get_by_id,
  ad_post,
  ad_delete_by_id,
  resize_image,
  ad_get_user_ads,
  ad_search_keywords
};
