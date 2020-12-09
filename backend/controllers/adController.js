'use strict';

const TAG = 'adController: ';
const adModel = require('../models/adModel');
const {resizeImg} = require('../utils/resize');

/*
  Gets data from adModel to respond to different requests from adRoute.
 */

// ------------------------ Basic ad stuff --------------------------------

/**
 * Responds with all ads of requested type from database
 */
const ad_get_list = async (req, res) => {
  const ads = await adModel.getAllAds(req);
  res.json(ads);
};

/**
 * Save an ad into database
 */
const ad_post = async (req, res) => {
  try {
    const ok = await adModel.postAd(req);
    res.json(ok);
  } catch (e) {
    console.log(e);
  }
};

/**
 * Get all information of a single ad with its id
 */
const ad_get_by_id = async (req, res) => {
  const ad = await adModel.getAdById(req);
  res.json(ad);
};

/**
 * Get all of user's posted ads
 */
const ad_get_user_ads = async (req, res) => {
  const userAds = await adModel.getAllUserAds(req);
  res.json(userAds);
};

/**
 * Delete an ad
 */
const ad_delete_by_id = async (req, res) => {

  // Get the original lister of the ad which is asked to be deleted
  const adCreator = await adModel.getAdLister(req);
  // Get the id of the deleting user from the token
  const tokenId = req.user.user_id;

  // Check if the two user ids match, continue deletion if true
  if (tokenId === adCreator) {
    const deletion = await adModel.deleteAdById(req);
    res.json(deletion);
  } else res.json('You are not authorized to delete this ad, or this ad ' +
      'does not exist!');
};

// ------------------- Search features ----------------------------------

/**
 * Search all ads in the database with parameters (keywords,type,category)
 */
const ad_search_keywords = async (req, res) => {
  const results = await adModel.searchAd(req);
  res.json(results);
};

/**
 * Get all ads specified by the category requested (and type)
 */
const ad_get_by_category = async (req, res) => {
  const adsByCtg = await adModel.getByCategory(req);
  res.json(adsByCtg);
};

// --------------------------- Other --------------------------------------
/**
 * Resize an image, save the smaller version of it
 */
const resize_image = async (file, res, next) => {
  try {
    const ready = await resizeImg({width: 320, height: 320}, file.path,
        './ads/thumbnails/' + file.filename);
    if (ready) {
      console.log(TAG, 'Resize', ready);
      next();
    }
  } catch (e) {
    console.log(TAG, e);
    next();
  }
};

// Fetches all categories available for frontend
const ad_get_categories = async (req, res, next) => {
  const getAllCategories = await adModel.getAllCategories(req);
  res.json(getAllCategories);
};

module.exports = {
  ad_get_list,
  ad_get_by_id,
  ad_post,
  ad_delete_by_id,
  resize_image,
  ad_get_user_ads,
  ad_search_keywords,
  ad_get_by_category,
  ad_get_categories,
};
