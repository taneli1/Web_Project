'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const validate = require('../utils/validation');

router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Register an user, login with the information after
router.post('/register',
    validate.userRegister,
    authController.user_create_post,
    authController.login,
);

// Update user information
router.put('/update/:id',
    passport.authenticate('jwt', {session: false}),
    validate.userUpdate,
    validate.paramId,
    authController.user_update,
);

// Delete an user (not currently used in the app! All commented for now)
router.delete('/:id',
    passport.authenticate('jwt', {session: false}),
    validate.paramId,
    authController.user_delete);

module.exports = router;