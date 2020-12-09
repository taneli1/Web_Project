'use strict';

// All validation here

const {check ,validationResult} = require('express-validator');
// Check for any errors in validation
const validationRes =  (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log({errors: errors.array()});
        return res.status(422).json({errors: errors.array()});
    }
    next();
}

// Posting an ad
exports.adPost = [
    check('item_name', '3-40 chars').isLength({min: 3, max: 40}),
    check('city', '3-50 chars').isLength({min: 3, max: 50}),
    check('price', 'Must be a number').isLength({min: 1, max: 10}).isNumeric(),
    check('description', 'Max 1000 characters').isLength({max: 1000}),
    validationRes
]

// User Registration
exports.userRegister = [
    check('name', 'Minimum 3 characters').isLength({min: 3, max: 40}),
    check('email', 'Email is not valid').isEmail().isLength({min: 3, max: 50}),
    check('password', 'At least one upper case letter, min 8').matches('(?=.*[A-Z]).{8,}'),
    check('phoneNumber', '8-13').isLength({min: 8, max: 13}).isNumeric(),
    check('user_city', '3-50').isLength({min: 3, max: 50}),
    validationRes
]

// User update
exports.userUpdate = [
    check('editUserName', 'Min length 3 chars').isLength({min: 3, max: 40}),
    check('editEmail', 'Email is not valid').isEmail().isLength({min: 3, max: 50}),
    check('editCity', 'Minimum 3 characters').isLength({min: 3,max: 50}),
    check('editPhoneNumber', '8-13').isLength({min: 8, max: 13}).isNumeric(),
    validationRes
]

// Check param id
exports.paramId = [
    check('id','id must be numeric').isNumeric(),
    validationRes
]

// Param Category
exports.paramCategory = [
    check('category', 'Category must be alphanumeric').isAlphanumeric(),
    validationRes
]

// Param adType
exports.paramType = [
    check('ad_type', 'ad_type characters only').isAlpha(),
    validationRes
]

// Search
exports.paramKeyword = [
    check('keywords','Search must only contain alphanumeric and spaces').matches(/^[\w\-\s]+$/),
    validationRes
]

// Check vote value, 0 or 1
exports.paramVote = [
    check('value','Value needs to be 0 or 1').matches(/^[01]$/),
    validationRes
]
