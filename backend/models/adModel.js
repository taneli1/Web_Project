'use strict';

const TAG = 'adModel: ';
const pool = require('../database/database');
const promisePool = pool.promise();

// Delete unneeded things from a response
const cleanUpResponse = async (arr) => {
  // Delete unneeded stuff
  for (let i = 0; i < arr.length; i++) {
    delete arr[i].password;
    delete arr[i].listed_by;
    delete arr[i].ctg_ref;
  }
  return arr;
};

/*
  Handles all the communication with db regarding ads. Almost all the methods
  take req.params.ad_type to differentiate what ads are targeted with the request.

  This leads to the file being very long and painful to modify, would do differently
  next time. Would have been easier to save everything in the same table...
 */

// -------------------------------------------------------------------------
// ---------------------------- Get from db --------------------------------
// -------------------------------------------------------------------------

/**
 * Get all ads of specified type from DB, join with image table, return all
 */
const getAllAds = async (req) => {

  const type = req.params.ad_type;
  try {
    const [rows] = await promisePool.execute(
        'SELECT bm_ad.*, bm_images.image, bm_user.user_id, bm_ctg.category ' +
        'FROM bm_ad ' +
        'LEFT JOIN bm_images ' +
        'ON bm_ad.ad_id=bm_images.ad_ref ' +
        'LEFT JOIN bm_user ' +
        'ON bm_ad.listed_by=bm_user.user_id ' +
        'LEFT JOIN bm_ctg ' +
        'ON bm_ad.ctg_ref=bm_ctg.ctg_id ' +
        'WHERE type = ? ' +
        'ORDER BY posted_on DESC ',
        [type]);
    console.log(cleanUpResponse(rows));
    return cleanUpResponse(rows);
  } catch (e) {
    console.log(TAG + e.message);
  }
};

/**
 * Get a single ad from DB with the id of ad,
 * get all images and user info too
 */
const getAdById = async (req) => {

  const adId = req.params.id;
  try {
    const [rows] = await promisePool.execute(
        'SELECT bm_ad.*, bm_images.image, bm_user.*, bm_ctg.category ' +
        'FROM bm_ad ' +
        'LEFT JOIN bm_user ' +
        'ON bm_ad.listed_by=bm_user.user_id ' +
        'LEFT JOIN bm_ctg ' +
        'ON bm_ad.ctg_ref=bm_ctg.ctg_id ' +
        'LEFT JOIN bm_images ' +
        'ON bm_ad.ad_id=bm_images.ad_ref ' +
        'WHERE ad_id = ? ',
        [adId]);
    console.log(cleanUpResponse(rows));
    return rows[0];
  } catch (e) {
    console.error(TAG, e.message);
  }
};

/**
 * Gets all of the users ads, both sell and buy
 */
const getAllUserAds = async (req) => {

  const userId = req.params.id;
  try {
    const [rows] = await promisePool.execute(
        'SELECT bm_ad.*, bm_images.image, bm_ctg.category, bm_user.user_id ' +
        'FROM bm_ad ' +
        'LEFT JOIN bm_images ' +
        'ON bm_ad.ad_id=bm_images.ad_ref ' +
        'LEFT JOIN bm_ctg ' +
        'ON bm_ad.ctg_ref=bm_ctg.ctg_id ' +
        'LEFT JOIN bm_user ' +
        'ON bm_ad.listed_by=bm_user.user_id ' +
        'WHERE listed_by = ? ' +
        'ORDER BY posted_on DESC',
        [userId]);
    console.log(cleanUpResponse(rows));
    return cleanUpResponse(rows);
  } catch (e) {
    console.error(TAG, e.message);
  }
};

// ------------------------- Search & categories ---------------------------
// -------------------------------------------------------------------------

/**
 * Search with a keyword from database, searches the ad for matching
 * item names
 */
const searchAd = async (req) => {

  const search = '%' + req.params.keywords + '%';
  const adType = req.params.ad_type;
  const ctgId = req.params.category;

  // If category sent from frontend is not a number, search the db without it
  if (isNaN(ctgId)) {
    try {
      const [rows] = await promisePool.execute(
          'SELECT bm_ad.*, bm_images.image, bm_user.user_id, bm_ctg.category ' +
          'FROM bm_ad ' +
          'LEFT JOIN bm_images ' +
          'ON bm_ad.ad_id=bm_images.ad_ref ' +
          'LEFT JOIN bm_user ' +
          'ON bm_ad.listed_by=bm_user.user_id ' +
          'LEFT JOIN bm_ctg ' +
          'ON bm_ad.ctg_ref=bm_ctg.ctg_id ' +
          'WHERE item_name LIKE ? AND type = ? ' +
          'ORDER BY posted_on DESC',
          [search, adType]);
      console.log(cleanUpResponse(rows));
      return cleanUpResponse(rows);
    } catch (e) {
      console.error(TAG, e.message);
    }
  }
  // If frontend sent a category id, search with it
  else {
    try {
      const [rows] = await promisePool.execute(
          'SELECT bm_ad.*, bm_images.image, bm_user.user_id, bm_ctg.category ' +
          'FROM bm_ad ' +
          'LEFT JOIN bm_images ' +
          'ON bm_ad.ad_id=bm_images.ad_ref ' +
          'LEFT JOIN bm_user ' +
          'ON bm_ad.listed_by=bm_user.user_id ' +
          'LEFT JOIN bm_ctg ' +
          'ON bm_ad.ctg_ref=bm_ctg.ctg_id ' +
          'WHERE item_name LIKE ? AND type = ? AND ctg_id = ? ' +
          'ORDER BY posted_on DESC',
          [search, adType, ctgId]);
      console.log(cleanUpResponse(rows));
      return cleanUpResponse(rows);
    } catch (e) {
      console.error(TAG, e.message);
    }
  }

};

/**
 * Get results from database based on the category of the item.
 */
const getByCategory = async (req) => {

  const adType = req.params.ad_type;
  const category = req.params.category;

  try {
    if (!isNaN(category)) {
      const [rows] = await promisePool.execute(
          'SELECT bm_ad.*, bm_images.image, bm_user.user_id, bm_ctg.category ' +
          'FROM bm_ad ' +
          'LEFT JOIN bm_images ' +
          'ON bm_ad.ad_id=bm_images.ad_ref ' +
          'LEFT JOIN bm_user ' +
          'ON bm_ad.listed_by=bm_user.user_id ' +
          'LEFT JOIN bm_ctg ' +
          'ON bm_ad.ctg_ref=bm_ctg.ctg_id ' +
          'WHERE type = ? AND ctg_id = ? ' +
          'ORDER BY posted_on DESC',
          [adType, category]);
      console.log(cleanUpResponse(rows));
      return cleanUpResponse(rows);
    } else { // Pretty redundant, could just use basic getAllAds
      const [rows] = await promisePool.execute(
          'SELECT bm_ad.*, bm_images.image, bm_user.user_id, bm_ctg.category ' +
          'FROM bm_ad ' +
          'LEFT JOIN bm_images ' +
          'ON bm_ad.ad_id=bm_images.ad_ref ' +
          'LEFT JOIN bm_user ' +
          'ON bm_ad.listed_by=bm_user.user_id ' +
          'LEFT JOIN bm_ctg ' +
          'ON bm_ad.ctg_ref=bm_ctg.ctg_id ' +
          'WHERE type = ? ' +
          'ORDER BY posted_on DESC',
          [adType]);
      console.log(cleanUpResponse(rows));
      return cleanUpResponse(rows);
    }

  } catch (e) {
    console.error(TAG, e.message);
  }
};

// -------------------------------------------------------------------------
// ---------------------------- Post to db ---------------------------------
// -------------------------------------------------------------------------

/**
 * Post an ad into db
 */
const postAd = async (req) => {

  // Get user id from token
  const tokenId = req.user.user_id;

  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO bm_ad ' +
        '(item_name, price, description, city, ctg_ref, type, listed_by) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?);',
        [
          req.body.item_name, req.body.price,
          req.body.description, req.body.city,
          req.body.category, req.body.ad_type,
          tokenId]);

    // Inject the insert id of the ad to pass on to image uploading
    req.body.insertId = rows.insertId;
    await postImages(req);
    return rows.insertId;
  } catch (e) {
    console.error(TAG, e);
    return 0;
  }

};

/**
 * Save images to db, return the insertId , which is then saved to ad table
 * with all the other dbInit
 */
const postImages = async (req) => {

  const images = req.files;
  for (let i = 0; i < images.length; i++) {
    try {
      const [rows] = await promisePool.execute(
          'INSERT INTO bm_images (image, ad_ref) ' +
          'VALUES (?,?);',
          [
            images[i].filename, req.body.insertId,
          ]);
      console.log('Uploaded image: ', rows.insertId);
    } catch (e) {
      console.error(TAG, e);
      return 0;
    }
  }

};

// -------------------------------------------------------------------------
// ---------------------------- Delete from db -----------------------------
// -------------------------------------------------------------------------

/**
 * Delete a single ad from DB with the id of ad
 */
const deleteAdById = async (req) => {

  const adId = req.params.id;
  try {
    const [ad] = await promisePool.execute(
        'DELETE FROM bm_ad ' +
        'WHERE ad_id = ?',
        [adId]);

    const [images] = await promisePool.execute(
        'DELETE FROM bm_images ' +
        'WHERE ad_ref = ?',
        [adId]);

    return {
      'Ad': ad,
      'Images': images,
    };
  } catch (e) {
    console.error(TAG, 'delete:', e.message);
  }
};

// -------------------------------------------------------------------------
// ---------------------------- Other --------------------------------------
// -------------------------------------------------------------------------

// Get all categories for frontend
const getAllCategories = async (req) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT * FROM bm_ctg');
    return rows;
  } catch (e) {
    console.error(TAG, e.message);
  }
};

/**
 * Returns the id of the ad lister, used for checking deletion
 */
const getAdLister = async (req) => {

  const deleteId = req.params.id;
  try {
    const [rows] = await promisePool.execute(
        'SELECT listed_by FROM bm_ad ' +
        'WHERE ad_id = ?',
        [deleteId]);
    return rows[0].listed_by;
  } catch (e) {
    console.error(TAG, e.message);
  }
};

module.exports = {
  getAllAds,
  getAdById,
  postAd,
  deleteAdById,
  getAllUserAds,
  searchAd,
  getByCategory,
  getAdLister,
  getAllCategories,
};