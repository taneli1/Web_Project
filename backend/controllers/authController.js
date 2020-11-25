'use strict';
<<<<<<< HEAD
=======
// TODO SecretOrPrivateKey into a file, read from there
>>>>>>> 972094a188db4f36c1a627374b127382f49eedfb

const TAG = 'authController: '
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel');
const { validationResult} = require('express-validator');

<<<<<<< HEAD

const login = (req, res) => {

  // Need to save email in username to make authentication work
=======
/**
 * Login to a user account with req params
 */
const login = (req, res) => {

  // Need to save email as username to make authentication work in passport
>>>>>>> 972094a188db4f36c1a627374b127382f49eedfb
  req.body.username = req.body.email

  passport.authenticate('local', {session: false}, (err, user, info) => {

    if (info) console.log('authController login info: ', info)

    delete user.password
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

<<<<<<< HEAD
const user_create_post = async (req, res, next) => {

=======
/**
 * Create an user with req params, checks if user with the email requested
 * already exists. Res includes the err message if user already exists.
 */
const user_create_post = async (req, res, next) => {

  console.log(TAG , "UserCreate")
>>>>>>> 972094a188db4f36c1a627374b127382f49eedfb
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(TAG,'user create error', errors);
    res.send(errors.array());
  } else {

<<<<<<< HEAD
    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(req.body.password, salt)

    if (await userModel.createUser(req)) {
      next();
    } else {
      res.status(400).json({error: 'register error'});
=======
    // Password Hashing
    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(req.body.password, salt)

    /*
    Since createUser returns the insertID of the account created,
    Check if the answer is number, if it is, we know that the
    User registration completed successfully.
    Else respond with the err message, inside of const ok
     */
    const ok = await userModel.createUser(req)

    if (!isNaN(ok)) {
      next();
    } else {
      res.status(400).json({error: ok});
>>>>>>> 972094a188db4f36c1a627374b127382f49eedfb
    }
  }
};

const logout = (req, res) => {
  req.logout();
  res.json({message: 'logout'});
};

module.exports = {
  login,
  user_create_post,
  logout
};