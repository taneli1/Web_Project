'use strict';
const pool = require('../database/database');
const promisePool = pool.promise();
const TAG = 'userModel: ';

const getAllUsers = async () =>  {
  try {
    const [rows] = await promisePool.execute('SELECT name, city FROM bm_user');
    return rows;
  }
  catch (e) {
    console.log(TAG + e.message);
  }
};

module.exports = {
  getAllUsers
};