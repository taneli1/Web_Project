'use strict';

const express = require('express');
const router = express.Router();
const repController = require('../controllers/repController');
const validate = require('../utils/validation');
const passport = require('passport');

// Get all of user's reputation votes
router.get('/:id',
    validate.paramId,
    repController.rep_get_user_rep);

// Check if logged user has voted for another user (For frontend display purposes)
router.get('/vote/:id',
    passport.authenticate('jwt', {session: false}),
    validate.paramId);

// Save / modify a vote for user| :id = who to vote for, :value = 0,1 (dislike,like)
router.post('/:id/:value',
    passport.authenticate('jwt', {session: false}),
    validate.paramId,
    validate.paramVote,
    repController.rep_vote);

// Delete a vote from user
router.delete('/:id',
    passport.authenticate('jwt', {session: false}),
    validate.paramId,
    repController.rep_delete_vote);

module.exports = router;