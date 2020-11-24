'use strict';

const TAG = 'adModel: '
const pool = require('../database/database');
const promisePool = pool.promise();

/**
 * Get all ads of type sell from DB
 * @returns Array of the ads
 */
const getAllAdsTypeSell = async () =>  {
  try {
    const [rows] = await promisePool.execute('SELECT item_name, city, price, description, listed_by FROM bm_ad');
    console.log(rows);
    return rows;
  }
  catch (e) {
    console.log(TAG + e.message);
  }
}

module.exports = {
  getAllAdsTypeSell
}