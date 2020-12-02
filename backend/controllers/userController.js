'use strict';

const TAG = 'userController: ';
const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');


/*
  Acts as the middleman for basic user fetches only between userRoute and userModel.
  More complex interaction is found in authController.
 */


/**
 * Get all users
 * @see userModel.getAllUsers()
 */
const user_list_get = async (req, res) => {
  const users = await userModel.getAllUsers();
  res.json(users);
};

/**
 * Return a single user with user id
 */
const user_get_by_id = async (req, res) => {
  const user = await userModel.getUserById(req.params.id);
  res.json(user);
};

module.exports = {
  user_list_get,
  user_get_by_id,
};