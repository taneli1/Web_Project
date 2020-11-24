'use strict';

const TAG = 'userController: ';
const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');

/**
 * Get all users
 * @see userModel.getAllUsers()
 */
const user_list_get = async (req, res) => {
  const users = await userModel.getAllUsers();
  res.json(users);
};

/**
 * Create an user, fetch the same user from db
 * @see userModel.getUser()
 */
const user_create = async (req, res) => {

  console.log(TAG, req.body, req.file);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const id = await userModel.createUser(req);
  const user = await userModel.getUser(id);
  res.send(user);
};

/**
 * Return a single user with user id
 */
const user_get_by_id = async (req, res) => {
  const user = await userModel.getUser(req.params.id);
  res.json(user);
};

module.exports = {
  user_list_get,
  user_create,
  user_get_by_id,
};