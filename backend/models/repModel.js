'use strict';
const pool = require('../database/database');
const promisePool = pool.promise();
const TAG = 'repModel: ';

/*
  Provides the reputation dbInit for users.
 */

const userExists = async (userId) => {
  try {
    const [user] = await promisePool.execute(
        'SELECT user_id FROM bm_user ' +
        'WHERE user_id = ?',
        [userId]);
    return user.length === 1;
  } catch (e) {
    console.log(e);
  }
};

// Get all reputation with an user id
const getUserRep = async (req) => {
  const userId = req.params.id;
  try {
    const [rows] = await promisePool.execute(
        'SELECT is_like FROM bm_rep ' +
        'WHERE user = ?',
        [userId]);
    return rows;
  } catch (e) {
    console.log(TAG + e.message);
  }
};

// Like or dislike another user
const voteUser = async (req) => {

  const userId = req.params.id;
  // Get id voter from token
  const voterId = req.user.user_id;
  const vote = req.params.value;

  console.log(userId, voterId, vote);

  // Check if the user being voted exists
  const isUser = await userExists(userId);
  if (!isUser) {
    return 'The account you tried to vote for does not exist';
  }

  // Continue with the vote process
  try {
    // Check if the voter has already cast a vote on that user
    const [checkExisting] = await promisePool.execute(
        'SELECT * FROM bm_rep ' +
        'WHERE user = ? AND voter = ?',
        [userId, voterId]);

    // If not, add to DB
    if (checkExisting.length === 0) {
      const [rows] = await promisePool.execute(
          'INSERT INTO bm_rep ' +
          '(user,voter,is_like) ' +
          'VALUES (?, ?, ?);',
          [userId, voterId, vote]);
      return `Vote casted successfully!`;
    }
    // Update old entry
    else {
      const [update] = await promisePool.execute(
          'UPDATE bm_rep SET is_like = ? WHERE user = ? AND voter = ?;',
          [vote, userId, voterId]);
      return 'Updated old vote!';
    }
  } catch (e) {
    console.log(TAG + e.message);
  }
};

// Delete a rep vote
const deleteVote = async (req) => {

  const userId = req.params.id;
  // Get id voter from token
  const voterId = req.user.user_id;

  try {
    const [rows] = await promisePool.execute(
        'DELETE FROM bm_rep WHERE user = ? AND voter = ? ',
        [userId, voterId]);
    return rows;
  } catch (e) {
    console.log(TAG + e.message);
  }
};

// Get logged in user's vote for another user (For frontend display purposes)
const getVote = async (req) => {

  // User who's votes we are checking
  const userId = req.params.id;
  // Get the user id from token
  const voterId = req.user.user_id;

  try {
    const [rows] = await promisePool.execute(
        'SELECT is_like FROM bm_rep ' +
        'WHERE user = ? AND voter = ?',
        [userId, voterId]);
    console.log('Vote value: ', rows);
    return rows;
  } catch (e) {
    console.log(TAG + e.message);
  }
};

module.exports = {
  getUserRep,
  voteUser,
  deleteVote,
  getVote,
};