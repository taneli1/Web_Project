'use strict';
// TODO Validate the fields saved to the database

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.user_list_get);
router.get('/:id', userController.user_get_by_id);

module.exports = router;