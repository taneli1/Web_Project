'use strict';

const TAG = 'adModel: ';
const pool = require('../database/database');
const promisePool = pool.promise();
const fs = require('fs');

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

// TODO Save thumbnail in ad table, additional images only fetched when
//  opening up a single ad page
//  - Validate user input (ad_type)
// -------------------------------------------------------------------------
// ---------------------------- Get from db --------------------------------
// -------------------------------------------------------------------------

/**
 * Get all ads of specified type from DB, join with image table, return all
 * @param req specifies what kind of ads we want to get
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
 * TODO Return and clean up index 0
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

  const userId = req.params.user_id;
  try {
    const [rows] = await promisePool.execute(
        'SELECT bm_ad.*, bm_images.image, bm_ctg.category ' +
        'FROM bm_ad ' +
        'LEFT JOIN bm_images ' +
        'ON bm_ad.ad_id=bm_images.ad_ref ' +
        'LEFT JOIN bm_ctg ' +
        'ON bm_ad.ctg_ref=bm_ctg.ctg_id ' +
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
  const ctgId = '4'

  // If category id was provided, could not get if/cases to work
  if (ctgId){
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
  // If not
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
        'WHERE item_name LIKE ? AND type = ? ' +
        'ORDER BY posted_on DESC',
        [search, adType]);
    console.log(cleanUpResponse(rows));
    return cleanUpResponse(rows);
  }
    catch (e) {
    console.error(TAG, e.message);
    }
  }

};

/**
 * Get results from database based on the category of the item.
 */
const getByCategory = async (req) => {

  const adType = req.params.ad_type;
  const category = req.params.ctg;

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
        'WHERE type = ? AND ctg_id = ? ' +
        'ORDER BY posted_on DESC',
        [adType, category]);
    console.log(cleanUpResponse(rows));
    return cleanUpResponse(rows);
  } catch (e) {
    console.error(TAG, e.message);
  }
};

/**
 *
 */

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
 * with all the other data
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
 * TODO Remove images locally
 */
const deleteAdById = async (req) => {

  const adId = req.params.ad_id;
  try {
    const [ad] = await promisePool.execute(
        'DELETE FROM bm_ad ' +
        'WHERE ad_id = ?',
        [adId]);

    const [images] = await promisePool.execute(
        'DELETE FROM bm_images ' +
        'WHERE ad_ref = ?',
        [adId]);

    // Remove the files from local
    /*      try {
            fs.unlinkSync(path);
            fs.unlinkSync(path2);
          } catch (err) {
            console.error(err);
          }*/
    return {
      "Ad" : ad,
      "Images" : images
    }
  } catch (e) {
    console.error(TAG, 'delete:', e.message);
  }
};

// -------------------------------------------------------------------------
// ---------------------------- Other --------------------------------------
// -------------------------------------------------------------------------

// Get all categories
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

  const deleteId = req.params.ad_id;
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