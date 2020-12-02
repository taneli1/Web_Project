'use strict';

const TAG = 'authController: ';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');

/*
  Acts as the middleman to authRoute and userModel
  for more complex user interaction (Login, register...).

  Basic fetches are done via userController.
 */

/**
 * Login to a user account with req params
 */
const login = (req, res) => {

  // Need to save email as username to make authentication work in passport
  req.body.username = req.body.email;

  passport.authenticate('local', {session: false}, (err, user, info) => {

    if (info) console.log('authController login info: ', info);

    delete user.password;
    if (err || !user) {
      return res.status(400).json({
        message: `${TAG}: Something is not right`,
        user: user,
      });
    }

    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(user, 'testing');
      return res.json({user, token});
    });
  })
  (req, res);
};

/**
 * Create an user with req params, checks if user with the email requested
 * already exists. Res includes the err message if user already exists.
 */
const user_create_post = async (req, res, next) => {

  console.log(TAG, 'UserCreate');
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(TAG, 'user create error', errors);
    res.send(errors.array());
  }
  else {

    // Password Hashing
    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(req.body.password, salt);

    /*
    Since createUser returns the insertID of the account created,
    Check if the answer is number, if it is, we know that the
    User registration completed successfully.
    Else respond with the err message, inside of const ok
     */
    const ok = await userModel.createUser(req);

    if (!isNaN(ok)) {
      next();
    }
    else {
      res.status(400).json({error: ok});
    }
  }
};

/**
 * Delete an user
 */
const user_delete = async (req, res) => {
  const userDeletion = await userModel.deleteUser(req);
  res.json(userDeletion);
};

/**
 * Update user
 */
const user_update = async (req, res) => {
  const editOk = userModel.updateUser(req);
  res.json(editOk);
};

// Logout
const logout = (req, res) => {
  req.logout();
  res.json({message: 'logout'});
};

module.exports = {
  login,
  user_create_post,
  logout,
  user_delete,
  user_update,
};