'use strict';
const pool = require('../database/database');
const promisePool = pool.promise();
const TAG = 'userModel: ';

/**
 * Gets all users from database
 */
const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT name, city FROM bm_user');
    return rows;
  }
  catch (e) {
    console.log(TAG + e.message);
  }
};

/** TODO Return only stuff needed
 * Returns a single user from db with the req id with ALL the data under that id
 */
const getUser = async (id) => {
  try {
    console.log(TAG + 'getUser :', id);
    const [rows] = await promisePool.execute('SELECT * FROM bm_user WHERE user_id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('userModel:', e.message);
  }
};

/**
 * Creates an user to database
 * @return Users id in database
 */
const createUser = async (req) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO bm_user (name, password, email, phone_number, city)' +
        ' VALUES (?, ?, ?, ?, ?);',
        [
          req.body.name, req.body.password,
          req.body.email, req.body.phone_number,
          req.body.city]);

    console.log(TAG + `insert ${rows.insertId}`);
    return rows.insertId;
  }
  catch (e) {
    console.error(TAG , e);
    return 0;
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUser
};