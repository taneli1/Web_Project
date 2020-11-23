'use strict';

const TAG = 'adController: ';
const adModel = require('../models/adModel');

/**
 * Responds with ads of type sell from database
 */
const ad_list_get_type_sell = async (req, res) => {
  const ads = await adModel.getAllAdsTypeSell();
  res.json(ads);
};

module.exports = {
  ad_list_get_type_sell,
};
