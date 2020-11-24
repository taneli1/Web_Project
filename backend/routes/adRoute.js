'use strict';

const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

router.get('/', adController.ad_get_list);
router.post('/', adController.ad_post);

module.exports = router;