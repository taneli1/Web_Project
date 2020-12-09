'use strict';

const express = require('express');
const router = express.Router();
const TAG = 'rootRoute: ';

// Just to check if app is running
router.get('/', (req, res) => {
  console.log(TAG + 'Get req');
  res.send(`App is running`);
});

module.exports = router;