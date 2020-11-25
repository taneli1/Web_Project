'use strict';
<<<<<<< HEAD
// TODO Validation
=======
// TODO Validation of all registration fields, dont res with all data
//  - Login automatically after account creation
>>>>>>> 972094a188db4f36c1a627374b127382f49eedfb
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
<<<<<<< HEAD
    authController.user_create_post,
    authController.login,
=======
    authController.user_create_post
>>>>>>> 972094a188db4f36c1a627374b127382f49eedfb
);


module.exports = router;