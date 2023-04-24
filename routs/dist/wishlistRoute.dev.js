"use strict";

var express = require('express');

var auth = require('../controller/authController');

var _require = require('../controller/wishlistController'),
    addProductToWishlist = _require.addProductToWishlist,
    removeProductFromWishlist = _require.removeProductFromWishlist,
    getLoggedUserWishlist = _require.getLoggedUserWishlist;

var router = express.Router();
router.use(auth.protect, auth.allowedTo('user'));
router.route('/').post(addProductToWishlist).get(getLoggedUserWishlist);
router["delete"]('/:productId', removeProductFromWishlist);
module.exports = router;