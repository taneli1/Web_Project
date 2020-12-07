'use strict';
// TODO Validation of all registration fields, dont res with all data
//  - Login automatically after account creation
//  - Probably require auth to access some routes

const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authController = require('../controllers/authController');
const passport = require('passport');

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

router.put('/update/:id',
    passport.authenticate('jwt', {session: false}),
    [
      body('editUserName', 'min length 3 chars').isLength({min: 3}),
      body('editEmail', 'email is not valid').isEmail(),
      body('editCity', 'minimum 2 characters').isLength({min: 2}),
      body('editPhoneNumber', 'must be a phone num').isLength({min: 8}).isNumeric(),
    ],
    authController.user_update
)

router.delete('/:id',
    passport.authenticate('jwt', {session: false}),
    authController.user_delete);

module.exports = router;