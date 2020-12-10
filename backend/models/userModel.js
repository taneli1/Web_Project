'use strict';
const pool = require('../database/database');
const promisePool = pool.promise();
const TAG = 'userModel: ';

/*
  Handles all communication with database regarding users.
 */

/**
 * Gets all usernames and cities from database
 * @return array with the information
 */
const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT name, user_city FROM bm_user');
    return rows;
  } catch (e) {
    console.log(TAG + e.message);
  }
};

/**
 * Returns a single user from db with the requested id.
 * @return array, has only one user in it
 */
const getUserById = async (id) => {
  try {
    console.log(TAG + 'getUser :', id);
    const [rows] = await promisePool.execute(
        'SELECT * FROM bm_user WHERE user_id = ?',
        [id]);

    delete rows[0].password;
    return rows[0];
  } catch (e) {
    console.error('userModel:', e.message);
  }
};

/**
 * Get user from DB for login purposes only
 * @param [email] of the user
 */
const getUserLogin = async (email) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT * FROM bm_user WHERE email = ?;',
        email);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }
};

/**
 * Creates an user to the database
 * @return Int, The user_id of the created user
 */
const createUser = async (req) => {

  // Check if account with the email exists, if not, continue with registration
  const exists = await getUserLogin([req.body.email]);
  // console.log(TAG , "Exists: " , exists)

  if (exists.length === 0) {
    try {
      const [rows] = await promisePool.execute(
          'INSERT INTO bm_user (name, password, email, phone_number, user_city)' +
          ' VALUES (?, ?, ?, ?, ?);',
          [
            req.body.name, req.body.passwordHash,
            req.body.email, req.body.phone_number,
            req.body.city]);

      console.log(TAG + `insert ${rows.insertId}`);
      return rows.insertId;
    } catch (e) {
      console.error(TAG, e);
      return 0;
    }
  } else {
    console.log(TAG,
        `Account with email address ${req.body.email} already exists!`);
    return `Account with email address ${req.body.email} already exists!`;
  }
};

/**
 * Updates user fields in database with the values provided, returns true/false.
 * @return Boolean, True if everything went as expected.
 */
const updateUser = async (req) => {
  try {
    const [rows] = await promisePool.execute(
        'UPDATE bm_user SET name = ?, user_city = ?, email = ?, phone_number = ? WHERE user_id = ?;',
        [
          req.body.editUserName,
          req.body.editCity,
          req.body.editEmail,
          req.body.editPhoneNumber,
          req.params.id]);
    console.log('user update:', rows);
    return rows.affectedRows === 1;
  } catch (e) {
    return false;
  }
};

/**
 * Delete an user
 * @return boolean, true if something was removed, false otherwise
 */
const deleteUser = async (req) => {

  try {
    console.log(TAG, 'delete user');
    const [rows] = await promisePool.execute(
        'DELETE FROM bm_user WHERE user_id = ?',
        [req.params.id]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error(TAG, 'delete:', e.message);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  getUserLogin,
  deleteUser,
  updateUser,
};