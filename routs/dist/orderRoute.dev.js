"use strict";

var express = require('express');

var _require = require('../controller/orderController'),
    createCashOrder = _require.createCashOrder,
    findAllOrders = _require.findAllOrders,
    findSpecificOrder = _require.findSpecificOrder,
    filterOrderForLoggedUser = _require.filterOrderForLoggedUser,
    updateOrderToPaid = _require.updateOrderToPaid,
    updateOrderToDelivered = _require.updateOrderToDelivered,
    checkoutSession = _require.checkoutSession;

var authService = require('../controller/authController');

var router = express.Router();
router.use(authService.protect);
router.get('/checkout-session/:cartId', authService.allowedTo('user'), checkoutSession);
router.route('/:cartId').post(authService.allowedTo('user'), createCashOrder);
router.get('/', authService.allowedTo('user', 'admin', 'manager'), filterOrderForLoggedUser, findAllOrders);
router.get('/:id', findSpecificOrder);
router.patch('/:id/pay', authService.allowedTo('admin', 'manager'), updateOrderToPaid);
router.patch('/:id/deliver', authService.allowedTo('admin', 'manager'), updateOrderToDelivered);
module.exports = router;