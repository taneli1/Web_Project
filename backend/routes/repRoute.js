'use strict';

const express = require('express');
const router = express.Router();
const repController = require('../controllers/repController');
const validate = require('../utils/validation');
const passport = require('passport');


router.get('/:id', repController.rep_get_user_rep);

router.post('/:id/:value',
    passport.authenticate('jwt', {session: false}),
    repController.rep_vote);

router.delete('/:id',
    passport.authenticate('jwt', {session: false}),
    repController.rep_delete_vote);

module.exports = router;