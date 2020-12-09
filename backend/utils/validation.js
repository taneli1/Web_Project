'use strict';


const {check ,validationResult} = require('express-validator');

exports.adPost = [
    check('item_name', 'Min length 3 chars').isLength({min: 222}),
    check('city', 'Min length 3 chars').isLength({min: 3}),
    check('price', 'Must be a number').isLength({min: 1}).isNumeric(),
    check('description', 'Min length 3 chars').isLength({min: 3}),
    (req,res,next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            console.log({errors: errors.array()});
            return res.status(422).json({errors: errors.array()});
        }
        next();
    }
]

