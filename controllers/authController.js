'use strict';

const TAG = 'authController: '
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel');
const { validationResult} = require('express-validator');


const login = (req, res) => {

  // Need to save email in username to make authentication work
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

const user_create_post = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(TAG,'user create error', errors);
    res.send(errors.array());
  } else {

    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(req.body.password, salt)

    if (await userModel.createUser(req)) {
      next();
    } else {
      res.status(400).json({error: 'register error'});
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