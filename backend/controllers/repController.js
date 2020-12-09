'use strict'

const repModel = require('../models/repModel');

// Get user rep with user id
const rep_get_user_rep = async (req, res) => {
  const rep = await repModel.getUserRep(req);
  res.json(rep);
};

// See if logged in has voted for an user (For frontend display purposes)
const rep_get_vote = async (req, res) => {
  const vote = await repModel.getVote(req);
  res.json(vote);
};

// Vote for a user, also modifies existing vote if it exists
const rep_vote = async (req, res) => {
  const vote = await repModel.voteUser(req);
  res.json(vote);
};

// Delete a vote from a user
const rep_delete_vote = async (req, res) => {
  const del = await repModel.deleteVote(req);
  res.json(del);
};

module.exports = {
  rep_get_user_rep,
  rep_vote,
  rep_delete_vote,
  rep_get_vote
}