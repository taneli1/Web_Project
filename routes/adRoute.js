'use strict';

const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

router.get('/', adController.ad_list_get_type_sell);

module.exports = router;