'use strict';

const express = require('express');
const router = express.Router();
const TAG = 'rootRoute: ';

router.get('/', (req, res) => {
  console.log(TAG + 'Get req');
  res.send(`RootRoute get`);
});

module.exports = router;