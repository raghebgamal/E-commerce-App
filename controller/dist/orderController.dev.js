"use strict";

var stripe = require('stripe')(process.env.STRIPE_SECRET);

var asyncHandler = require('express-async-handler');

var factory = require('./handlersFactory');

var ApiError = require('../utils/apiError');

var User = require('../models/userModel');

var Product = require('../models/productModel');

var Cart = require('../models/cartModel');

var Order = require('../models/orderModel'); // @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User


exports.createCashOrder = asyncHandler(function _callee(req, res, next) {
  var taxPrice, shippingPrice, cart, cartPrice, totalOrderPrice, order, bulkOption;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // app settings
          taxPrice = 0;
          shippingPrice = 0; // 1) Get cart depend on cartId

          _context.next = 4;
          return regeneratorRuntime.awrap(Cart.findById(req.params.cartId));

        case 4:
          cart = _context.sent;

          if (cart) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", next(new ApiError("There is no such cart with id ".concat(req.params.cartId), 404)));

        case 7:
          // 2) Get order price depend on cart price "Check if coupon apply"
          cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
          totalOrderPrice = cartPrice + taxPrice + shippingPrice; // 3) Create order with default paymentMethodType cash

          _context.next = 11;
          return regeneratorRuntime.awrap(Order.create({
            user: req.user._id,
            cartItems: cart.cartItems,
            shippingAddress: req.body.shippingAddress,
            totalOrderPrice: totalOrderPrice
          }));

        case 11:
          order = _context.sent;

          if (!order) {
            _context.next = 18;
            break;
          }

          bulkOption = cart.cartItems.map(function (item) {
            return {
              updateOne: {
                filter: {
                  _id: item.product
                },
                update: {
                  $inc: {
                    quantity: -item.quantity,
                    sold: +item.quantity
                  }
                }
              }
            };
          });
          _context.next = 16;
          return regeneratorRuntime.awrap(Product.bulkWrite(bulkOption, {}));

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(Cart.findByIdAndDelete(req.params.cartId));

        case 18:
          res.status(201).json({
            status: 'success',
            data: order
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.filterOrderForLoggedUser = asyncHandler(function _callee2(req, res, next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (req.user.role === 'user') req.filterObj = {
            user: req.user._id
          };
          next();

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager

exports.findAllOrders = factory.getAllModels(Order); // @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager

exports.findSpecificOrder = factory.getModelById(Order); // @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager

exports.updateOrderToPaid = asyncHandler(function _callee3(req, res, next) {
  var order, updatedOrder;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Order.findById(req.params.id));

        case 2:
          order = _context3.sent;

          if (order) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next(new ApiError("There is no such a order with this id:".concat(req.params.id), 404)));

        case 5:
          // update order to paid
          order.isPaid = true;
          order.paidAt = Date.now();
          _context3.next = 9;
          return regeneratorRuntime.awrap(order.save());

        case 9:
          updatedOrder = _context3.sent;
          res.status(200).json({
            status: 'success',
            data: updatedOrder
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager

exports.updateOrderToDelivered = asyncHandler(function _callee4(req, res, next) {
  var order, updatedOrder;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Order.findById(req.params.id));

        case 2:
          order = _context4.sent;

          if (order) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next(new ApiError("There is no such a order with this id:".concat(req.params.id), 404)));

        case 5:
          // update order to paid
          order.isDelivered = true;
          order.deliveredAt = Date.now();
          _context4.next = 9;
          return regeneratorRuntime.awrap(order.save());

        case 9:
          updatedOrder = _context4.sent;
          res.status(200).json({
            status: 'success',
            data: updatedOrder
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User

exports.checkoutSession = asyncHandler(function _callee5(req, res, next) {
  var taxPrice, shippingPrice, cart, cartPrice, totalOrderPrice, session;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          // app settings
          taxPrice = 0;
          shippingPrice = 0; // 1) Get cart depend on cartId

          _context5.next = 4;
          return regeneratorRuntime.awrap(Cart.findById(req.params.cartId));

        case 4:
          cart = _context5.sent;

          if (cart) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", next(new ApiError("There is no such cart with id ".concat(req.params.cartId), 404)));

        case 7:
          // 2) Get order price depend on cart price "Check if coupon apply"
          cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
          totalOrderPrice = cartPrice + taxPrice + shippingPrice; // 3) Create stripe checkout session

          _context5.next = 11;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            line_items: [{
              price_data: {
                unit_amount: totalOrderPrice * 100,
                currency: 'egp',
                product_data: {
                  name: req.user.name
                }
              },
              quantity: 1
            }],
            mode: 'payment',
            success_url: "".concat(req.protocol, "://").concat(req.get('host'), "/orders"),
            cancel_url: "".concat(req.protocol, "://").concat(req.get('host'), "/cart"),
            customer_email: req.user.email,
            client_reference_id: req.params.cartId,
            metadata: req.body.shippingAddress
          }));

        case 11:
          session = _context5.sent;
          // 4) send session to response
          res.status(200).json({
            status: 'success',
            session: session
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  });
});

var createCardOrder = function createCardOrder(session) {
  var cartId, shippingAddress, oderPrice, cart, user, order, bulkOption;
  return regeneratorRuntime.async(function createCardOrder$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          cartId = session.client_reference_id;
          shippingAddress = session.metadata;
          oderPrice = session.amount_total / 100;
          _context6.next = 5;
          return regeneratorRuntime.awrap(Cart.findById(cartId));

        case 5:
          cart = _context6.sent;
          _context6.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            email: session.customer_email
          }));

        case 8:
          user = _context6.sent;
          _context6.next = 11;
          return regeneratorRuntime.awrap(Order.create({
            user: user._id,
            cartItems: cart.cartItems,
            shippingAddress: shippingAddress,
            totalOrderPrice: oderPrice,
            isPaid: true,
            paidAt: Date.now(),
            paymentMethodType: 'card'
          }));

        case 11:
          order = _context6.sent;

          if (!order) {
            _context6.next = 18;
            break;
          }

          bulkOption = cart.cartItems.map(function (item) {
            return {
              updateOne: {
                filter: {
                  _id: item.product
                },
                update: {
                  $inc: {
                    quantity: -item.quantity,
                    sold: +item.quantity
                  }
                }
              }
            };
          });
          _context6.next = 16;
          return regeneratorRuntime.awrap(Product.bulkWrite(bulkOption, {}));

        case 16:
          _context6.next = 18;
          return regeneratorRuntime.awrap(Cart.findByIdAndDelete(cartId));

        case 18:
        case "end":
          return _context6.stop();
      }
    }
  });
}; // @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User


exports.webhookCheckout = asyncHandler(function _callee6(req, res, next) {
  var sig, event;
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          sig = req.headers['stripe-signature'];
          _context7.prev = 1;
          event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
          _context7.next = 8;
          break;

        case 5:
          _context7.prev = 5;
          _context7.t0 = _context7["catch"](1);
          return _context7.abrupt("return", res.status(400).send("Webhook Error: ".concat(_context7.t0.message)));

        case 8:
          if (event.type === 'checkout.session.completed') {
            //  Create order
            createCardOrder(event.data.object);
          }

          res.status(200).json({
            received: true
          });

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[1, 5]]);
});