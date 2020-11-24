'use strict';

const TAG = 'adModel: '
const pool = require('../database/database');
const promisePool = pool.promise();

/**
 * Get all ads of type sell from DB
 * @returns Array of the ads
 * TODO Differentiate sell/buy fetches
 */
const getAllAdsTypeSell = async () =>  {
  try {
    const [rows] = await promisePool.execute('SELECT item_name, city, price, description, listed_by FROM bm_ad_sell');
    console.log(rows);
    return rows;
  }
  catch (e) {
    console.log(TAG + e.message);
  }
}

/**
 * Post a single ad into db, req needs to have an ad_type, sell or buy, defaults to sell
 *  TODO Get poster user id and save it
 */
const postAd = async (req) => {

    // TODO Better way
    const adType = req.body.ad_type || 'sell'
    try {
      const [rows] = await promisePool.execute(
          'INSERT INTO bm_ad_' + adType + ' (item_name, price, description)' +
          ' VALUES (?, ?, ?);',
          [
            req.body.item_name, req.body.price,
            req.body.description]);

      console.log(TAG + `insert ${rows.insertId}`);
      return rows.insertId;
    }
    catch (e) {
      console.error(TAG, e);
      return 0;
    }
};


module.exports = {
  getAllAdsTypeSell,
  postAd
}