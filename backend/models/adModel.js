'use strict';

const TAG = 'adModel: ';
const pool = require('../database/database');
const promisePool = pool.promise();

/*
  This model has methods for all ad handling. Both ads, type sell and buy
  have identical methods for everything, except the table names are different.
  This is done since sql queries can't have any variables to change table names
  dynamically.

  Could have saved everything in the same table, but this way the performance
  is better, since the frontend does not ever need both types of ads at the same time.
  No need to go through one big table and find which ones the user wants, can
  just easily get results from one table without confirming the types of ads.
 */

// -------------------------------------------------------------------------
// ---------------------------- Get from db --------------------------------
// -------------------------------------------------------------------------

/**
 * Get all ads of type buy from DB, join with image table, return all
 */
const getAllAdsBuy = async (req) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT * FROM bm_ad_buy ' +
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
};

/**
 * Get all ads of type sell from DB, join with image table, return all
 */
const getAllAdsSell = async (req) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT * FROM bm_ad_sell ' +
        'LEFT JOIN bm_ad_sell_images ON bm_ad_sell.images_table' +
        '=bm_ad_sell_images.images_id ' +
        'LEFT JOIN bm_user ON bm_ad_sell.listed_by=bm_user.user_id');

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
};

/**
 * Get a single ad from DB with the id of ad
 */
const getAdByIdBuy = async (req) => {

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
};

/**
 * Get a single ad from DB with the id of ad
 */
const getAdByIdSell = async (req) => {
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
};

// -------------------------------------------------------------------------
// ---------------------------- Post to db ---------------------------------
// -------------------------------------------------------------------------

/**
 * Post a single ad into db, type buy
 */
const postAdBuy = async (req) => {

  // Get user id from token
  const tokenId = req.user.user_id;
  const images = await postImagesBuy(req);

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
};

/**
 * Post a single ad into db, type sell
 */
const postAdSell = async (req) => {

  // Get user id from token
  const tokenId = req.user.user_id;
  const images = await postImagesSell(req);

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
};

/**
 * Save images to db, return the insertId , which is then saved to ad table
 * with all the other data
 */
const postImagesBuy = async (req) => {

  const images = req.files;
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO bm_ad_buy_images (image_1)' +
        ' VALUES (?);',
        [
          images[0],
        ]);

    console.log(TAG + `Images success: ${rows.insertId}`);
    return rows.insertId;
  }
  catch (e) {
    console.error(TAG, e);
    return 0;
  }
};

/**
 * Save images to db, return the insertId , which is then saved to ad table
 * with all the other data
 */
const postImagesSell = async (req) => {

  const images = req.files;
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO bm_ad_sell_images (image_1)' +
        ' VALUES (?);',
        [
          images[0],
        ]);

    console.log(TAG + `Images success: ${rows.insertId}`);
    return rows.insertId;
  }
  catch (e) {
    console.error(TAG, e);
    return 0;
  }
};

// -------------------------------------------------------------------------
// ---------------------------- Delete from db -----------------------------
// -------------------------------------------------------------------------

// TODO Deletion needs confirmation to not delete anyone else's posts
/**
 * Delete a single ad from DB with the id of ad
 */
const deleteAdByIdBuy = async (req) => {
  try {
    console.log(TAG, 'delete');
    const [rows] = await promisePool.execute(
        'DELETE FROM bm_ad_buy WHERE ad_id = ?', [req.params.id]);
    return rows.affectedRows === 1;
  }
  catch (e) {
    console.error(TAG, 'delete:', e.message);
  }
};

/**
 * Delete a single ad from DB with the id of ad
 */
const deleteAdByIdSell = async (req) => {
  try {
    console.log(TAG, 'delete');
    const [rows] = await promisePool.execute(
        'DELETE FROM bm_ad_sell WHERE ad_id = ?', [req.params.id]);
    return rows.affectedRows === 1;
  }
  catch (e) {
    console.error(TAG, 'delete:', e.message);
  }
};

module.exports = {
  getAllAdsBuy,
  getAllAdsSell,
  getAdByIdBuy,
  getAdByIdSell,
  postAdBuy,
  postAdSell,
  deleteAdByIdBuy,
  deleteAdByIdSell,
};