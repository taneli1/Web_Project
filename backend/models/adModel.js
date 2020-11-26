'use strict';

const TAG = 'adModel: ';
const pool = require('../database/database');
const promisePool = pool.promise();

/**
 * Get all ads of type sell from DB
 * @param req Needs to have ad_type in body.req
 * @returns Array of the ads
 */
const getAllAds = async (req) => {

  const adType = getAdType(req);
  try {
    const [rows] = await promisePool.execute(
        'SELECT item_name, city, price, description, listed_by FROM bm_ad_' +
        adType);
    console.log(rows);
    return rows;
  }
  catch (e) {
    console.log(TAG + e.message);
  }
};

/**
 * Post a single ad into db
 * @param req Needs to have ad_type in body.req
 */
const postAd = async (req) => {

  // Get user id from token
  const tokenId = req.user.user_id;
  console.log(TAG, "postAd: ", tokenId)

  const images = await postImages(req)

  const adType = getAdType(req);
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO bm_ad_' + adType + ' (item_name, price, description, city, images_table, listed_by)' +
        ' VALUES (?, ?, ?, ?, ?);',
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

const postImages = async (req) => {

  const adType = getAdType(req);
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO bm_ad_' + adType + '_images (image_1)' +
        ' VALUES (?);',
        [
          req.file
        ]);

    console.log(TAG + `insert ${rows.insertId}`);
    return rows.insertId;
  }
  catch (e) {
    console.error(TAG, e);
    return 0;
  }


}




/**
 * Get a single ad from DB with the id of ad
 * @param req Needs to have ad_type in body.req
 */
const getAdById = async (req) => {

  const adType = getAdType(req);
  try {
    console.log(TAG + 'getAd :', req.params.id);
    const [rows] = await promisePool.execute(
        'SELECT * FROM bm_ad_' + adType + ' WHERE ad_id = ?', [req.params.id]);
    return rows[0];
  }
  catch (e) {
    console.error(TAG, e.message);
  }
};

/**
 * Delete a single ad from DB with the id of ad
 * @param req Needs to have ad_type in body.req
 * @return returns a boolean, true if removed, false if not
 */
const deleteAdById = async (req) => {

  // TODO Check that listed_by == user_id

  const adType = getAdType(req);
  try {
    console.log(TAG , 'delete');
    const [rows] = await promisePool.execute(
        'DELETE FROM bm_ad_' + adType + ' WHERE ad_id = ?', [req.params.id]);
    return rows.affectedRows === 1;
  }
  catch (e) {
    console.error(TAG, 'delete:', e.message);
  }
}

/**
 * Get ad_type from request either buy or sell, this is used in sql query
 * @param req
 */
const getAdType = (req) => {

  if (req.body.ad_type === 'buy') {
    return 'buy';
  }
  else return 'sell';
};

module.exports = {
  getAllAds,
  getAdById,
  postAd,
  deleteAdById
};