'use strict';

const TAG = 'adModel: ';
const pool = require('../database/database');
const promisePool = pool.promise();


/*
  Handles all the communication with db regarding ads. Almost all the methods
  take req.params.ad_type to differentiate what ads are targeted with the request.
  This is done since buy- and sell ads are saved in different tables to improve
  performance.
 */



// TODO Save thumbnail in ad table, additional images only fetched when
//  opening up a single ad page
//  - Validate user input
// -------------------------------------------------------------------------
// ---------------------------- Get from db --------------------------------
// -------------------------------------------------------------------------

/**
 * Get all ads from DB, join with image table, return all
 * @param req specifies what kind of ads we want to get
 */
const getAllAds = async (req) => {

  const type = req.params.ad_type;

  if (type === 'buy') {
    try {
      const [rows] = await promisePool.execute(
          'SELECT bm_ad_buy.*, bm_ad_buy_images.image_1 FROM bm_ad_buy ' +
          'LEFT JOIN bm_ad_buy_images ON bm_ad_buy.images_table' +
          '=bm_ad_buy_images.images_id ' +
          'LEFT JOIN bm_user ON bm_ad_buy.listed_by=bm_user.user_id');

      // Delete unneeded stuff
      for (let i = 0; i < rows.length; i++) {
        delete rows[i].password;
        delete rows[i].admin_key;
      }
      // console.log(rows);
      return rows;
    }
    catch (e) {
      console.log(TAG + e.message);
    }
  }
  else if (type === 'sell') {
    try {
      const [rows] = await promisePool.execute(
          'SELECT bm_ad_sell.*, bm_ad_sell_images.image_1 FROM bm_ad_sell ' +
          'LEFT JOIN bm_ad_sell_images ON bm_ad_sell.images_table' +
          '=bm_ad_sell_images.images_id ' +
          'LEFT JOIN bm_user ON bm_ad_sell.listed_by=bm_user.user_id');

      // Delete unneeded stuff
      for (let i = 0; i < rows.length; i++) {
        delete rows[i].password;
        delete rows[i].admin_key;
      }
      console.log(rows)
      // console.log(rows);
      return rows;
    }
    catch (e) {
      console.log(TAG + e.message);
    }
  }
  else return 'Request did not specify an ad type';
};

/**
 * Get a single ad from DB with the id of ad
 * @param req specifies what kind of ads are targeted
 */
const getAdById = async (req) => {

  const type = req.params.ad_type;
  if (type === 'buy') {
    try {
      console.log(TAG + 'getAd :', req.params.id);
      const [rows] = await promisePool.execute(
          'SELECT * FROM bm_ad_buy ' +
          'LEFT JOIN bm_ad_buy_images ON bm_ad_buy.images_table=' +
          'bm_ad_buy_images.images_id ' +
          'LEFT JOIN bm_user ON bm_ad_buy.listed_by=bm_user.user_id ' +
          'WHERE ad_id = ? ',
          [req.params.id]);
      delete rows[0].password;
      delete rows[0].admin_key;
      return rows[0];
    }
    catch (e) {
      console.error(TAG, e.message);
    }
  }
  else if (type === 'sell') {
    try {
      console.log(TAG + 'getAd :', req.params.id);
      const [rows] = await promisePool.execute(
          'SELECT * FROM bm_ad_sell ' +
          'LEFT JOIN bm_ad_sell_images ON bm_ad_sell.images_table=' +
          'bm_ad_sell_images.images_id ' +
          'LEFT JOIN bm_user ON bm_ad_sell.listed_by=bm_user.user_id ' +
          'WHERE ad_id = ?',
          [req.params.id]);
      delete rows[0].password;
      delete rows[0].admin_key;
      return rows[0];
    }
    catch (e) {
      console.error(TAG, e.message);
    }
  }
  else return 'Request did not specify an ad type';
};

/**
 * Gets all of the users ads, both sell and buy
 * @param req specifies what kind of ads are targeted
 */
const getAllUserAds = async (req) => {

  try {
    console.log(TAG + 'getAllUserAds :', req.params.userId);

    const [buy] = await promisePool.execute(
        'SELECT * FROM bm_ad_buy ' +
        'LEFT JOIN bm_ad_buy_images ON bm_ad_buy.images_table=' +
        'bm_ad_buy_images.images_id ' +
        'WHERE listed_by = ? ',
        [req.params.userId]);

    const [sell] = await promisePool.execute(
        'SELECT * FROM bm_ad_sell ' +
        'LEFT JOIN bm_ad_sell_images ON bm_ad_sell.images_table=' +
        'bm_ad_sell_images.images_id ' +
        'WHERE listed_by = ? ',
        [req.params.userId]);

    return buy.concat(sell);
  }
  catch (e) {
    console.error(TAG, e.message);
  }
};

/**
 * Search with a keyword from database, searches the ad for matching
 * item names
 */
const searchAd = async (req) => {

  // TODO Validation
  const search = '%' + req.params.keywords + '%'

  try {

    const [buy] = await promisePool.execute(
        'SELECT * FROM bm_ad_buy ' +
        'WHERE item_name LIKE ?',
        [search]);

    const [sell] = await promisePool.execute(
        'SELECT * FROM bm_ad_sell ' +
        'WHERE item_name LIKE ?',
        [search]);

    return buy.concat(sell);
  }
  catch (e) {
    console.error(TAG, e.message);
  }
};

// -------------------------------------------------------------------------
// ---------------------------- Post to db ---------------------------------
// -------------------------------------------------------------------------

/**
 * Post an ad into db
 * @param req specifies what kind of ad is saved
 */
const postAd = async (req) => {

  const type = req.params.ad_type;
  // Get user id from token
  const tokenId = req.user.user_id;
  const images = await postImages(req);

  if (type === 'buy') {

    try {
      const [rows] = await promisePool.execute(
          'INSERT INTO bm_ad_buy' +
          ' (item_name, price, description, city, images_table, listed_by)' +
          ' VALUES (?, ?, ?, ?, ?, ?);',
          [
            req.body.item_name, req.body.price,
            req.body.description, req.body.city,
            images, tokenId]);

      console.log(TAG + `insert ${rows.insertId}`);
      return rows.insertId;
    }
    catch (e) {
      console.error(TAG, e);
      return 0;
    }
  }
  else if (type === 'sell') {

    try {
      const [rows] = await promisePool.execute(
          'INSERT INTO bm_ad_sell' +
          ' (item_name, price, description, city, images_table, listed_by)' +
          ' VALUES (?, ?, ?, ?, ?, ?);',
          [
            req.body.item_name, req.body.price,
            req.body.description, req.body.city,
            images, tokenId]);

      console.log(TAG + `insert ${rows.insertId}`);
      return rows.insertId;
    }

    catch (e) {
      console.error(TAG, e);
      return 0;
    }
  }
  else return 'Request did not specify an ad type';
};

/**
 * Save images to db, return the insertId , which is then saved to ad table
 * with all the other data
 * @param req specifies what kind of ads are targeted
 */
const postImages = async (req) => {

  const type = req.params.ad_type;
  const images = req.file.filename;

  if (type === 'buy') {
    try {
      const [rows] = await promisePool.execute(
          'INSERT INTO bm_ad_buy_images (image_1)' +
          ' VALUES (?);',
          [
            images,
          ]);

      console.log(TAG + `Images success: ${rows.insertId}`);
      return rows.insertId;
    }
    catch (e) {
      console.error(TAG, e);
      return 0;
    }
  }
  else if (type === 'sell') {

    try {
      const [rows] = await promisePool.execute(
          'INSERT INTO bm_ad_sell_images (image_1)' +
          ' VALUES (?);',
          [
            images,
          ]);

      console.log(TAG + `Images success: ${rows.insertId}`);
      return rows.insertId;
    }
    catch (e) {
      console.error(TAG, e);
      return 0;
    }
  }
  else return 'Request did not specify an ad type';

};

// -------------------------------------------------------------------------
// ---------------------------- Delete from db -----------------------------
// -------------------------------------------------------------------------

// TODO Deletion needs confirmation to not delete anyone else's posts
/**
 * Delete a single ad from DB with the id of ad
 * @param req specifies what kind of ads are targeted
 */
const deleteAdById = async (req) => {

  const type = req.params.ad_type;
  if (type === 'buy') {
    try {
      console.log(TAG, 'delete');
      const [rows] = await promisePool.execute(
          'DELETE FROM bm_ad_buy WHERE ad_id = ?', [req.params.id]);
      return rows.affectedRows === 1;
    }
    catch (e) {
      console.error(TAG, 'delete:', e.message);
    }
  }
  else if (type === 'sell') {
    try {
      console.log(TAG, 'delete');
      const [rows] = await promisePool.execute(
          'DELETE FROM bm_ad_sell WHERE ad_id = ?', [req.params.id]);
      return rows.affectedRows === 1;
    }
    catch (e) {
      console.error(TAG, 'delete:', e.message);
    }
  }
  else return 'Request did not specify an ad type';
};

module.exports = {
  getAllAds,
  getAdById,
  postAd,
  deleteAdById,
  getAllUserAds,
  searchAd
};