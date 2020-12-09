'use strict';

const express = require('express');
const router = express.Router();
const TAG = 'rootRoute: ';

router.get('/', (req, res) => {
  console.log(TAG + 'Get req');
  res.send(`App is running`);
});

module.exports = router;