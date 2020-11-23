'use strict';

const TAG = 'userController: '
const userModel = require('../models/userModel');

const user_list_get = async (req, res) => {
  const users = await userModel.getAllUsers();
  res.json(users);
};

module.exports = {
  user_list_get
}