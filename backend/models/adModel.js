'use strict';

const TAG = 'adModel: ';
const pool = require('../database/database');
const promisePool = pool.promise();
const fs = require('fs');
const res = require("express");

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
      console.log(rows);
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
        'SELECT bm_ad_buy.*, bm_ad_buy_images.image_1 FROM bm_ad_buy ' +
        'LEFT JOIN bm_ad_buy_images ON bm_ad_buy.images_table=' +
        'bm_ad_buy_images.images_id ' +
        'WHERE listed_by = ? ',
        [req.params.userId]);

    const [sell] = await promisePool.execute(
        'SELECT bm_ad_sell.*, bm_ad_sell_images.image_1 FROM bm_ad_sell ' +
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

// ------------------------- Search & categories ---------------------------
// -------------------------------------------------------------------------

/**
 * Search with a keyword from database, searches the ad for matching
 * item names
 */
const searchAd = async (req) => {

  // TODO Validation
  const search = '%' + req.params.keywords + '%';
  const type = req.params.ad_type;

  if (type === 'buy') {
    try {
      const [buy] = await promisePool.execute(
          'SELECT * FROM bm_ad_buy ' +
          'WHERE item_name LIKE ?',
          [search]);
      return buy;
    }
    catch (e) {
      console.error(TAG, e.message);
    }
  }
  else if (type === 'sell') {
    try {
      const [sell] = await promisePool.execute(
          'SELECT * FROM bm_ad_sell ' +
          'WHERE item_name LIKE ?',
          [search]);
      return sell;
    }
    catch (e) {
      console.error(TAG, e.message);
    }
  }
  else return 'Request did not specify an ad type';
};

/**
 * Get results from database based on the category of the item.
 * Joins bm_ctg table to get ctg value
 */
const getByCategory = async (req) => {

  const type = req.params.ad_type;

  if (type === 'buy') {
    try {
      const [buy] = await promisePool.execute(
          'SELECT * FROM bm_ad_buy ' +
          'LEFT JOIN bm_ctg ON bm_ad_buy.category=' +
          'bm_ctg.ctg_id ' +
          'WHERE bm_ad_buy.category = ?',
          [req.params.ctg]);
      return buy;
    }
    catch (e) {
      console.error(TAG, e.message);
    }
  }
  else if (type === 'sell') {
    try {
      const [sell] = await promisePool.execute(
          'SELECT * FROM bm_ad_sell ' +
          'LEFT JOIN bm_ctg ON bm_ad_sell.category=' +
          'bm_ctg.ctg_id ' +
          'WHERE bm_ad_sell.category = ?',
          [req.params.ctg]);
      return sell;
    }
    catch (e) {
      console.error(TAG, e.message);
    }
  }
  else return 'Request did not specify an ad type';
};

/**
 * Returns the id of the ad lister
 */
const getAdLister = async (req) => {

  const type = req.params.ad_type;
  if (type === 'buy') {
    try {
      const [rows] = await promisePool.execute(
          'SELECT listed_by FROM bm_ad_buy ' +
          'WHERE ad_id = ?',
          [req.params.ad_id]);
      return rows[0].listed_by;
    }
    catch (e) {
      console.error(TAG, e.message);
    }
  }
  else if (type === 'sell') {
    try {
      const [rows] = await promisePool.execute(
          'SELECT listed_by FROM bm_ad_sell ' +
          'WHERE ad_id = ?',
          [req.params.ad_id]);
      return rows[0].listed_by;
    }
    catch (e) {
      console.error(TAG, e.message);
    }
  }
  else return 'Request did not specify an ad type';
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
          ' (item_name, price, description, city, category, images_table, listed_by)' +
          ' VALUES (?, ?, ?, ?, ?, ?, ?);',
          [
            req.body.item_name, req.body.price,
            req.body.description, req.body.city,
            req.body.category,
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
          ' (item_name, price, description, city, category, images_table, listed_by)' +
          ' VALUES (?, ?, ?, ?, ?, ?, ?);',
          [
            req.body.item_name, req.body.price,
            req.body.description, req.body.city,
            req.body.category,
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

/**
 * Delete a single ad from DB with the id of ad
 * @param req specifies what kind of ads are targeted
 * TODO Remove images
 *  - Get all images, remove from folders all the same names
 */
const deleteAdById = async (req) => {

  const type = req.params.ad_type;
  const adId = req.params.ad_id;
  if (type === 'buy') {
    try {

      // Get the image table corresponding to the table wanted to be removed
      const [imageTable] = await promisePool.execute(
          'SELECT bm_ad_buy.images_table, bm_ad_buy_images.* ' +
          'FROM bm_ad_buy LEFT JOIN bm_ad_buy_images ON ' +
          'bm_ad_buy.images_table=bm_ad_buy_images.images_id ' +
          'WHERE bm_ad_buy.ad_id = ?',
          [adId]);

      // Transform the answer into an array to access the image values
      const clonedArray = JSON.parse(JSON.stringify(imageTable))
      const another = JSON.parse((JSON.stringify(clonedArray[0])))
      // Values saved here
      const imageValues = Array.from(Object.values(another))

      // Loop through all the images in the table and remove them from the
      // folders.
      for (let i = 2; i < imageValues.length; i++) {
        if (imageValues[i] !== null){
          // Define the paths where the files are to be removed
          let path = './ads/images/'+ imageValues[i] ;
          let path2 = './ads/thumbnails/' + imageValues[i];

          // Try to remove them
          try {
            console.log(path)
            console.log(path2)
            fs.unlinkSync(path);
            fs.unlinkSync(path2);
          }
          catch (err) {
            console.error(err);
          }
        }
        // If image is null, break from loop
        else break
      }

      const [adTable] = await promisePool.execute(
          'DELETE FROM bm_ad_buy WHERE ad_id = ?',
          [adId]);

      const [imagesToDelete] = await promisePool.execute(
          'DELETE FROM bm_ad_buy_images WHERE images_id = ?',
          [imageValues[1]]);

      // Return both, true for both if both were removed
      return {
        "Table" : adTable.affectedRows === 1,
        "ImageTable" : imagesToDelete.affectedRows === 1
      };
    }
    catch (e) {
      console.error(TAG, 'delete:', e.message);
    }
  }
  else if (type === 'sell') {
    try {

      // Get the image table corresponding to the table wanted to be removed
      const [imageTable] = await promisePool.execute(
          'SELECT bm_ad_sell.images_table, bm_ad_sell_images.* ' +
          'FROM bm_ad_sell LEFT JOIN bm_ad_sell_images ON ' +
          'bm_ad_sell.images_table=bm_ad_sell_images.images_id ' +
          'WHERE bm_ad_sell.ad_id = ?',
          [adId]);

      // Transform the answer into an array to access the image values
      const clonedArray = JSON.parse(JSON.stringify(imageTable))
      const another = JSON.parse((JSON.stringify(clonedArray[0])))
      // Values saved here
      const imageValues = Array.from(Object.values(another))

      // Loop through all the images in the table and remove them from the
      // folders.
      for (let i = 2; i < imageValues.length; i++) {
        if (imageValues[i] !== null){
          // Define the paths where the files are to be removed
          let path = './ads/images/'+ imageValues[i] ;
          let path2 = './ads/thumbnails/' + imageValues[i];

          // Try to remove them
          try {
            console.log(path)
            console.log(path2)
            fs.unlinkSync(path);
            fs.unlinkSync(path2);
          }
          catch (err) {
            console.error(err);
          }
        }
        // If image is null, break from loop
        else break
      }

      const [adTable] = await promisePool.execute(
          'DELETE FROM bm_ad_sell WHERE ad_id = ?',
          [adId]);

      const [imagesToDelete] = await promisePool.execute(
          'DELETE FROM bm_ad_sell_images WHERE images_id = ?',
          [imageValues[1]]);

      // Return both, true for both if both were removed
      return {
        "Table" : adTable.affectedRows === 1,
        "ImageTable" : imagesToDelete.affectedRows === 1
      };
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
  searchAd,
  getByCategory,
  getAdLister,
};