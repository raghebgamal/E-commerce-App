"use strict";

var _require = require('express-validator'),
    check = _require.check,
    body = _require.body;

var validatorMiddleware = require('../../middlewares/validatorMiddleware');

var Review = require('../../models/reviewModel');

exports.createReviewValidator = [check('title').optional(), check('ratings').notEmpty().withMessage('ratings value required').isFloat({
  min: 1,
  max: 5
}).withMessage('Ratings value must be between 1 to 5'), check('user').isMongoId().withMessage('Invalid Review id format'), check('product').isMongoId().withMessage('Invalid Review id format').custom(function _callee(val, _ref) {
  var req, review;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          req = _ref.req;
          _context.next = 3;
          return regeneratorRuntime.awrap(Review.findOne({
            user: req.user._id,
            product: val
          }));

        case 3:
          review = _context.sent;

          if (!review) {
            _context.next = 6;
            break;
          }

          throw new Error('You already created a review before');

        case 6:
          return _context.abrupt("return", true);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}), validatorMiddleware];
exports.getReviewValidator = [check('id').isMongoId().withMessage('Invalid Review id format'), validatorMiddleware];
exports.updateReviewValidator = [check('id').isMongoId().withMessage('Invalid Review id format').custom(function _callee2(val, _ref2) {
  var req, review;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          req = _ref2.req;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Review.findById(val));

        case 3:
          review = _context2.sent;

          if (review) {
            _context2.next = 6;
            break;
          }

          throw new Error("There is no review with id ".concat(val));

        case 6:
          if (!(review.user._id.toString() !== req.user._id.toString())) {
            _context2.next = 8;
            break;
          }

          throw new Error("Your are not allowed to perform this action");

        case 8:
          return _context2.abrupt("return", true);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
}), validatorMiddleware];
exports.deleteReviewValidator = [check('id').isMongoId().withMessage('Invalid Review id format').custom(function _callee3(val, _ref3) {
  var req, review;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          req = _ref3.req;

          if (!(req.user.role === 'user')) {
            _context3.next = 9;
            break;
          }

          _context3.next = 4;
          return regeneratorRuntime.awrap(Review.findById(val));

        case 4:
          review = _context3.sent;

          if (review) {
            _context3.next = 7;
            break;
          }

          throw new Error("There is no review with id ".concat(val));

        case 7:
          if (!(review.user._id.toString() !== req.user._id.toString())) {
            _context3.next = 9;
            break;
          }

          throw new Error("Your are not allowed to perform this action");

        case 9:
          return _context3.abrupt("return", true);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  });
}), validatorMiddleware];