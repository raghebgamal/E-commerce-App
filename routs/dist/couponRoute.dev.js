"use strict";

var express = require('express');

var _require = require('../controller/couponController'),
    getCoupon = _require.getCoupon,
    getCoupons = _require.getCoupons,
    createCoupon = _require.createCoupon,
    updateCoupon = _require.updateCoupon,
    deleteCoupon = _require.deleteCoupon;

var authService = require('../controller/authController');

var router = express.Router();
router.use(authService.protect, authService.allowedTo('admin', 'manager'));
router.route('/').get(getCoupons).post(createCoupon);
router.route('/:id').get(getCoupon).patch(updateCoupon)["delete"](deleteCoupon);
module.exports = router;