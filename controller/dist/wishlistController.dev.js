"use strict";

var asyncHandler = require('express-async-handler');

var User = require('../models/userModel'); // @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Protected/User


exports.addProductToWishlist = asyncHandler(function _callee(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, {
            $addToSet: {
              wishlist: req.body.productId
            }
          }, {
            "new": true
          }));

        case 2:
          user = _context.sent;
          res.status(200).json({
            status: 'success',
            message: 'Product added successfully to your wishlist.',
            data: user.wishlist
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}); // @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Protected/User

exports.removeProductFromWishlist = asyncHandler(function _callee2(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, {
            $pull: {
              wishlist: req.params.productId
            }
          }, {
            "new": true
          }));

        case 2:
          user = _context2.sent;
          res.status(200).json({
            status: 'success',
            message: 'Product removed successfully from your wishlist.',
            data: user.wishlist
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // @desc    Get logged user wishlist
// @route   GET /api/v1/wishlist
// @access  Protected/User

exports.getLoggedUserWishlist = asyncHandler(function _callee3(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user._id).populate('wishlist'));

        case 2:
          user = _context3.sent;
          res.status(200).json({
            status: 'success',
            results: user.wishlist.length,
            data: user.wishlist
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
});