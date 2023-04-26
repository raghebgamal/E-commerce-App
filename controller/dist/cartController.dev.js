"use strict";

var asyncHandler = require('express-async-handler');

var ApiError = require('../utils/apiError');

var Product = require('../models/productModel');

var Coupon = require('../models/couponModel');

var Cart = require('../models/cartModel');

var calcTotalCartPrice = function calcTotalCartPrice(cart) {
  var totalPrice = 0;
  cart.cartItems.forEach(function (item) {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
}; // @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User


exports.addProductToCart = asyncHandler(function _callee(req, res, next) {
  var _req$body, productId, color, product, cart, productIndex;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, productId = _req$body.productId, color = _req$body.color;
          _context.next = 3;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 3:
          product = _context.sent;

          if (product) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", next(new ApiError("This product is not found in db", 404)));

        case 6:
          ;

          if (!(product.quantity < 0 || product.quantity === 0)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", next(new ApiError("sorry the product is out of stock", 404)));

        case 9:
          ; // 1) Get Cart for logged user

          _context.next = 12;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: req.user._id
          }));

        case 12:
          cart = _context.sent;

          if (cart) {
            _context.next = 19;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap(Cart.create({
            user: req.user._id,
            cartItems: [{
              product: productId,
              color: color,
              price: product.price
            }]
          }));

        case 16:
          cart = _context.sent;
          _context.next = 21;
          break;

        case 19:
          // product exist in cart, update product quantity
          productIndex = cart.cartItems.findIndex(function (item) {
            return item.product.toString() === productId && item.color === color;
          });

          if (productIndex > -1) {
            cart.cartItems[productIndex].quantity += 1;
          } else {
            // product not exist in cart,  push product to cartItems array
            cart.cartItems.push({
              product: productId,
              color: color,
              price: product.price
            });
          }

        case 21:
          // Calculate total cart price
          calcTotalCartPrice(cart);
          _context.next = 24;
          return regeneratorRuntime.awrap(cart.save());

        case 24:
          res.status(200).json({
            status: 'success',
            message: 'Product added to cart successfully',
            numOfCartItems: cart.cartItems.length,
            data: cart
          });

        case 25:
        case "end":
          return _context.stop();
      }
    }
  });
}); // @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User

exports.getLoggedUserCart = asyncHandler(function _callee2(req, res, next) {
  var cart;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: req.user._id
          }));

        case 2:
          cart = _context2.sent;

          if (cart) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new ApiError("There is no cart for this user id : ".concat(req.user._id), 404)));

        case 5:
          res.status(200).json({
            status: 'success',
            numOfCartItems: cart.cartItems.length,
            data: cart
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User

exports.removeSpecificCartItem = asyncHandler(function _callee3(req, res, next) {
  var cart;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Cart.findOneAndUpdate({
            user: req.user._id
          }, {
            $pull: {
              cartItems: {
                _id: req.params.itemId
              }
            }
          }, {
            "new": true
          }));

        case 2:
          cart = _context3.sent;
          calcTotalCartPrice(cart);
          _context3.next = 6;
          return regeneratorRuntime.awrap(cart.save());

        case 6:
          res.status(200).json({
            status: 'success',
            numOfCartItems: cart.cartItems.length,
            data: cart
          });

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // @desc    clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/User

exports.clearCart = asyncHandler(function _callee4(req, res, next) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Cart.findOneAndDelete({
            user: req.user._id
          }));

        case 2:
          res.status(204).send();

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User

exports.updateCartItemQuantity = asyncHandler(function _callee5(req, res, next) {
  var quantity, cart, itemIndex;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          quantity = req.body.quantity;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: req.user._id
          }));

        case 3:
          cart = _context5.sent;

          if (cart) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", next(new ApiError("there is no cart for user ".concat(req.user._id), 404)));

        case 6:
          itemIndex = cart.cartItems.findIndex(function (item) {
            return item._id.toString() === req.params.itemId;
          });

          if (!(itemIndex > -1)) {
            _context5.next = 11;
            break;
          }

          cart.cartItems[itemIndex].quantity = quantity;
          _context5.next = 12;
          break;

        case 11:
          return _context5.abrupt("return", next(new ApiError("there is no item for this id :".concat(req.params.itemId), 404)));

        case 12:
          calcTotalCartPrice(cart);
          _context5.next = 15;
          return regeneratorRuntime.awrap(cart.save());

        case 15:
          res.status(200).json({
            status: 'success',
            numOfCartItems: cart.cartItems.length,
            data: cart
          });

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User

exports.applyCoupon = asyncHandler(function _callee6(req, res, next) {
  var coupon, cart, totalPrice, discount, totalPriceAfterDiscount;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Coupon.findOne({
            name: req.body.coupon,
            expire: {
              $gt: Date.now()
            }
          }));

        case 2:
          coupon = _context6.sent;

          if (coupon) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", next(new ApiError("Coupon is invalid or expired")));

        case 5:
          _context6.next = 7;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: req.user._id
          }));

        case 7:
          cart = _context6.sent;
          totalPrice = cart.totalCartPrice;
          discount = coupon.discount; // 3) Calculate price after priceAfterDiscount

          totalPriceAfterDiscount = (totalPrice - totalPrice * discount / 100).toFixed(2); // 99.23

          cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
          _context6.next = 14;
          return regeneratorRuntime.awrap(cart.save());

        case 14:
          res.status(200).json({
            status: 'success',
            numOfCartItems: cart.cartItems.length,
            data: cart
          });

        case 15:
        case "end":
          return _context6.stop();
      }
    }
  });
});