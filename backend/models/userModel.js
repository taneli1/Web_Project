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

/**
 * Returns a single user from db with the req id. (ALL the data under that id)
 * TODO Return only stuff needed? Currently returns everything
 */
const getUserById = async (id) => {
  try {
    console.log(TAG + 'getUser :', id);
    const [rows] = await promisePool.execute(
        'SELECT * FROM bm_user WHERE user_id = ?', [id]);
    return rows[0];
  }
  catch (e) {
    console.error('userModel:', e.message);
  }
};

/**
 * Get user from DB
 * @param [email] of the user
 */
const getUserLogin = async (params) => {
  try {
    console.log(params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM bm_user WHERE email = ?;',
        params);
    console.log(TAG, rows);
    return rows;
  }
  catch (e) {
    console.log('error', e.message);
  }
};

/**
 * Creates an user to database
 * @return Users id in database
 */
const createUser = async (req) => {

  // Check if account with the email exists, if not, continue with registration
  const exists = await getUserLogin([req.body.email]);
  // console.log(TAG , "Exists: " , exists)

  if (exists.length === 0) {
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
      console.error(TAG, e);
      return 0;
    }
  }
  else {
    // TODO response to account existing to frontend, cant return anything here
    //  Since authController.user_create_post currently thinks reg is complete
    //  if something comes back
    console.log(TAG,
        `Account with email address ${req.body.email} already exists!`);
    return `Account with email address ${req.body.email} already exists!`;
  }
};

/**
 * Updates user fields in database with the values provided, returns true/false
 */
const updateUser = async (req) => {
  try {
    const [rows] = await promisePool.execute(
        'UPDATE bm_user SET name = ?, city = ?, email = ?, phone_number = ? WHERE user_id = ?;',
        [
          req.body.editUserName,
          req.body.editCity,
          req.body.editEmail,
          req.body.editPhoneNumber]);
    console.log('catModel update:', rows);
    return rows.affectedRows === 1;
  }
  catch (e) {
    return false;
  }
};

/**
 * Delete an user
 * @param req
 * @return boolean, true if something was removed, false otherwise
 */
const deleteUser = async (req) => {

  // TODO Check that user_id matches do delete

  try {
    console.log(TAG, 'delete user');
    const [rows] = await promisePool.execute(
        'DELETE FROM bm_user WHERE user_id = ?', [req.params.id]);
    return rows.affectedRows === 1;
  }
  catch (e) {
    console.error(TAG, 'delete:', e.message);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  getUserLogin,
  deleteUser,
  updateUser
};