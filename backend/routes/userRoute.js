'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validate = require('../utils/validation')

router.get('/', userController.user_list_get);
router.get('/:id',
    validate.paramId,
    userController.user_get_by_id);


module.exports = router;