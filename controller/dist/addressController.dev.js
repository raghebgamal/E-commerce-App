"use strict";

var asyncHandler = require('express-async-handler');

var User = require('../models/userModel'); // @desc    Add address to user addresses list
// @route   POST /api/v1/addresses
// @access  Protected/User


exports.addAddress = asyncHandler(function _callee(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, {
            $addToSet: {
              addresses: req.body
            }
          }, {
            "new": true
          }));

        case 2:
          user = _context.sent;
          res.status(200).json({
            status: 'success',
            message: 'Address added successfully.',
            data: user.addresses
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}); // @desc    Remove address from user addresses list
// @route   DELETE /api/v1/addresses/:addressId
// @access  Protected/User

exports.removeAddress = asyncHandler(function _callee2(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, {
            $pull: {
              addresses: {
                _id: req.params.addressId
              }
            }
          }, {
            "new": true
          }));

        case 2:
          user = _context2.sent;
          res.status(200).json({
            status: 'success',
            message: 'Address removed successfully.',
            data: user.addresses
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // @desc    Get logged user addresses list
// @route   GET /api/v1/addresses
// @access  Protected/User

exports.getLoggedUserAddresses = asyncHandler(function _callee3(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user._id).populate('addresses'));

        case 2:
          user = _context3.sent;
          res.status(200).json({
            status: 'success',
            results: user.addresses.length,
            data: user.addresses
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
});