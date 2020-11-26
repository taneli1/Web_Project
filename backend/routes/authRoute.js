'use strict';
// TODO Validation of all registration fields, dont res with all data
//  - Login automatically after account creation
//  - Probably require auth to access some routes

const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/register',
    [
      body('name', 'minimum 3 characters').isLength({min: 3}),
      body('email', 'email is not valid').isEmail(),
      body('password', 'at least one upper case letter').
          matches('(?=.*[A-Z]).{8,}'),
    ],
    authController.user_create_post,
    authController.login
);

router.delete('/:id', authController.user_delete);

module.exports = router;