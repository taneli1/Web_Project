'use strict';

const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authController = require('../controllers/authController');
const passport = require('passport');
const validate = require('../utils/validation');

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/register',
    validate.userRegister,
    authController.user_create_post,
    authController.login
);

router.put('/update/:id',
    passport.authenticate('jwt', {session: false}),
    validate.userUpdate,
    validate.paramId,
    authController.user_update
)

router.delete('/:id',
    passport.authenticate('jwt', {session: false}),
    validate.paramId,
    authController.user_delete);

module.exports = router;