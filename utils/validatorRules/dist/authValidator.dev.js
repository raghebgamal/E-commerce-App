"use strict";

var _require = require("express-validator"),
    check = _require.check,
    body = _require.body;

var validatorMiddleware = require("./../../middlewares/validatorMiddleware");

var slugify = require('slugify');

var User = require("./../../models/userModel");

var bcrypt = require("bcryptjs");

exports.signUpUserValidator = [check("name").notEmpty().withMessage("user name requierd").isLength({
  min: 3
}).withMessage("too short user name").isLength({
  max: 32
}).withMessage("too long user name"), body("name").optional().custom(function (val, _ref) {
  var req = _ref.req;
  req.body.slug = slugify(val);
  return true;
}), check("phone").optional().isMobilePhone(["ar-EG", "ar-SA"]).withMessage("enter valid mobile number about your country"), body("email").notEmpty().withMessage("user email is required ").isEmail().withMessage("email is invalid").custom(function _callee(val) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: val
          }));

        case 2:
          user = _context.sent;

          if (!user) {
            _context.next = 5;
            break;
          }

          throw new Error("E-mail already in use");

        case 5:
          ;
          return _context.abrupt("return", true);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}), check("password").notEmpty().withMessage("user password is required").isLength({
  min: 8
}).withMessage("too short user password").custom(function (val, _ref2) {
  var req = _ref2.req;

  if (val !== req.body.passwordConfirm) {
    throw new Error("password confirmation is not valid  plz enter same paswords");
  }

  return true;
}), body("passwordConfirm").notEmpty().withMessage("user passwordConfirm is required "), validatorMiddleware];
exports.loginUserValidator = [body("email").notEmpty().withMessage("user email is required ").isEmail().withMessage("email is invalid"), //.custom(async (val,{req}) => {
//   const user = await User.findOne({ email: val })
//   if (!user) {
//   throw new Error("E-mail not exist, from validator")
//   };
//   req.user = user;
//   return true;
// }),
check("password").notEmpty().withMessage("user password is required"), //   .custom(async (val, { req }) => {
//   if (req.user) {
//     const isCorrectPassword = await req.user.correctPassword(val, req.user.password);
//     if (!isCorrectPassword) {
//       throw new Error(`incorrect password plz enter the correct password ,from validator`);
//     }
//   }
//       return true;
// }),
validatorMiddleware];
exports.deleteUserValidatorById = [check("id").isMongoId().withMessage("invalid user id format"), validatorMiddleware];
exports.changeUserPasswordValidator = [check('id').isMongoId().withMessage('Invalid User id format'), body('currentPassword').notEmpty().withMessage('You must enter your current password'), body('passwordConfirm').notEmpty().withMessage('You must enter the password confirm'), body('password').notEmpty().withMessage('You must enter new password').custom(function _callee2(val, _ref3) {
  var req, user, isCorrectPassword;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          req = _ref3.req;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 3:
          user = _context2.sent;

          if (user) {
            _context2.next = 6;
            break;
          }

          throw new Error('There is no user for this id');

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.currentPassword, user.password));

        case 8:
          isCorrectPassword = _context2.sent;

          if (isCorrectPassword) {
            _context2.next = 11;
            break;
          }

          throw new Error('Incorrect current password');

        case 11:
          if (!(val !== req.body.passwordConfirm)) {
            _context2.next = 13;
            break;
          }

          throw new Error('Password Confirmation incorrect');

        case 13:
          return _context2.abrupt("return", true);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
}), validatorMiddleware];