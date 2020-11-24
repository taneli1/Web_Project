'use strict';

const TAG = 'adController: ';
const adModel = require('../models/adModel');

/**
 * Responds with ads of type sell from database
 */
const ad_get_list = async (req, res) => {
  const ads = await adModel.getAllAdsTypeSell("sell");
  res.json(ads);
};


const ad_post = async (req, res) => {
  const adOk = await adModel.postAd(req);
  res.json(adOk);
};

module.exports = {
  ad_get_list,
  ad_post
};
