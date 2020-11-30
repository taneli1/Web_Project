'use strict';
const {validationResult} = require('express-validator');
const TAG = 'adController: ';
const adModel = require('../models/adModel');
const {resizeImg} = require('../utils/resize');

/**
 * Responds with ads of requested type from database
 * TODO Get certain amount of ads (range, first 50, 50-100...)
 */
const ad_get_list = async (req, res) => {

  // What kind of ads were requested, calls to backend accordingly
  const type = req.params.ad_type;
  if (type === 'buy'){
    const ads = await adModel.getAllAdsBuy()
    res.json(ads);
  }
  else if (type === 'sell'){
    const ads = await adModel.getAllAdsBuy()
    res.json(ads);
  }
  else res.json('Request did not specify an ad type')
};

/**
 * Save an ad into database
 */
const ad_post = async (req, res) => {

  // Check for validation errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('validation', errors.array());
    return res.status(400).json({errors: errors.array()});
  }

  // If validation check passes, continue with requested ad_type/id.
  // res.json has the insert id of the ad.
  const type = req.params.ad_type;
  if (type === 'buy'){
    const validation = await adModel.postAdBuy(req)
    res.json(validation);
  }
  else if (type === 'sell'){
    const validation = await adModel.postAdSell(req)
    res.json(validation);
  }
  else res.json('Request did not specify an ad type')
};

/**
 * Get a single ad with ad_id
 */
const ad_get_by_id = async (req, res) => {

  const type = req.params.ad_type;
  if (type === 'buy'){
    const ad = await adModel.getAdByIdBuy(req)
    res.json(ad);
  }
  else if (type === 'sell'){
    const ad = await adModel.getAdByIdSell(req)
    res.json(ad);
  }
  else res.json('Request did not specify an ad type')
};

/**
 * Delete an ad
 */
const ad_delete_by_id = async (req,res ) => {
  const type = req.params.ad_type;
  if (type === 'buy'){
    const deletion = await adModel.deleteAdByIdBuy(req)
    res.json(deletion);
  }
  else if (type === 'sell'){
    const deletion = await adModel.deleteAdByIdSell(req)
    res.json(deletion);
  }
  else res.json('Request did not specify an ad type')
}

/**
 * Resize an image
 */
const resize_image = async (req, res, next) => {
  try {
    const ready = await resizeImg({width: 160, height: 160}, req.file.path,
        './backend/imgcache' + req.file.filename);
    if (ready) {
      console.log(TAG, "Resize", ready);
      next();
    }
  } catch (e) {
    console.log(TAG , e)
    next();
  }
}


module.exports = {
  ad_get_list,
  ad_get_by_id,
  ad_post,
  ad_delete_by_id,
  resize_image
};
