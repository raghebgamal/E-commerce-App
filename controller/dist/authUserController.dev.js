"use strict";

var User = require("./../models/userModel");

var jwt = require("jsonwebtoken");

var ApiError = require("./../utils/apiError");

var asyncHandler = require("express-async-handler");

var verifyToken = function verifyToken(token, secretKey) {
  return regeneratorRuntime.async(function verifyToken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", jwt.verify(token, secretKey));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

var createToken = function createToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED
  });
};

exports.sign_up = asyncHandler(function _callee(req, res, next) {
  var user, token;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.create(req.body));

        case 2:
          user = _context2.sent;
          token = createToken(user._id);
          res.status(201).json({
            status: "success",
            data: user,
            token: token
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.login = asyncHandler(function _callee2(req, res, next) {
  var _req$body, password, email, user, token;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, password = _req$body.password, email = _req$body.email;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 3:
          user = _context3.sent;
          _context3.t0 = !user;

          if (_context3.t0) {
            _context3.next = 9;
            break;
          }

          _context3.next = 8;
          return regeneratorRuntime.awrap(user.correctPassword(password, user.password));

        case 8:
          _context3.t0 = !_context3.sent;

        case 9:
          if (!_context3.t0) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", next(new ApiError(" email or password is  incorrect", 401)));

        case 11:
          token = createToken(user._id);
          res.status(200).json({
            status: "success",
            data: user,
            token: token
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.protect = asyncHandler(function _callee3(req, res, next) {
  var token, decoded, user;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
          }

          if (token) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", next(new ApiError("token is not found or logged out,plz give me the token to access, you are not logged in ,plz log in to access ,plz login then set a token ", 401)));

        case 3:
          _context4.next = 5;
          return regeneratorRuntime.awrap(verifyToken(token, process.env.JWT_SECRET));

        case 5:
          decoded = _context4.sent;
          _context4.next = 8;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 8:
          user = _context4.sent;

          if (user) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", next(new ApiError("the token about user-id is not longer exist , plz login then set the token ", 401)));

        case 11:
          next();

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  });
});