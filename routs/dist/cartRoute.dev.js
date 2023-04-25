"use strict";

var express = require('express');

var _require = require('../controller/cartController'),
    addProductToCart = _require.addProductToCart,
    getLoggedUserCart = _require.getLoggedUserCart,
    removeSpecificCartItem = _require.removeSpecificCartItem,
    clearCart = _require.clearCart,
    updateCartItemQuantity = _require.updateCartItemQuantity,
    applyCoupon = _require.applyCoupon;

var authService = require('../controller/authController');

var router = express.Router();
router.use(authService.protect, authService.allowedTo('user'));
router.route('/').post(addProductToCart).get(getLoggedUserCart)["delete"](clearCart);
router.patch('/applyCoupon', applyCoupon);
router.route('/:itemId').patch(updateCartItemQuantity)["delete"](removeSpecificCartItem);
module.exports = router;