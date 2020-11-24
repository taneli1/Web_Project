'use strict';

const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

// Both of these requests need a specifying parameter to decide which
// type of ads we want to fetch
router.get('/', adController.ad_get_list);
router.get('/:id', adController.ad_get_by_id);
// TODO VALIDATION REQUIRED
router.post('/', adController.ad_post);


router.delete('/:id', adController.ad_delete_by_id);

module.exports = router;