'use strict';

const TAG = 'authController: ';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

/*
  Acts as the middleman to authRoute and userModel
  for more complex user interaction (Login, register...).

  Basic user fetches are done via userController.
 */

/**
 * Login to a user account with req params
 */
const login = (req, res, next) => {

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
  (req, res, next);
};

/**
 * Create an user with req params, checks if user with the email requested
 * already exists. Res includes the err message if user already exists.
 */
const user_create_post = async (req, res, next) => {

  // Password Hashing
  const salt = bcrypt.genSaltSync(10);
  req.body.passwordHash = bcrypt.hashSync(req.body.password, salt);

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
    return res.status(400).json({error: ok});
  }

};

/**
 * Delete an user (Not currently used in the app!)
 */
const user_delete = async (req, res) => {
/*  const userDeletion = await userModel.deleteUser(req);
  res.json(userDeletion);*/
};

/**
 * Update an user
 */
const user_update = async (req, res) => {

  // See if the user wanted to be updated matches with the token user
  // Update if they do
  const tokenId = req.user.user_id;
  if (tokenId.toString() === req.params.id) {
    const editOk = userModel.updateUser(req);
    res.json(editOk);
  } else {
    res.json("Cannot update someone else's profile");
  }
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