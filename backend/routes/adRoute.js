'use strict';

const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

// Both of these requests need a specifying parameter to decide which
// type of ads we want to fetch
router.get('/', adController.ad_get_list);
router.post('/', adController.ad_post);

module.exports = router;