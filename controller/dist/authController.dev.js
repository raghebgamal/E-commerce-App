"use strict";

var User = require("./../models/userModel");

var jwt = require("jsonwebtoken");

var ApiError = require("./../utils/apiError");

var asyncHandler = require("express-async-handler");

var Email = require("./../utils/email/sendEmail");

var crypto = require("crypto");

var createToken = require("./../utils/generateToken");

var promisifyVerifyToken = function promisifyVerifyToken(token, secretKey) {
  return regeneratorRuntime.async(function promisifyVerifyToken$(_context) {
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
}; // const passwordChangedAfter=async(user,decoded)=>{
//     if (user.passwordChangedAt) {
//         const changedtime = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
//          return decoded.iat < changedtime;
//     }
//     return false
//     }


exports.activeMe = asyncHandler(function _callee(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.updateOne({
            email: req.body.email
          }, {
            $set: {
              active: true
            }
          }));

        case 2:
          user = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(new Email(user, "activation status", "Hi ,".concat(user.name, " your account activated")).sendEmail());

        case 5:
          res.status(200).json({
            status: "success",
            message: "your account activated"
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.sign_up = asyncHandler(function _callee2(req, res, next) {
  var user, token;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.create(req.body));

        case 2:
          user = _context3.sent;
          _context3.next = 5;
          return regeneratorRuntime.awrap(createToken(user));

        case 5:
          token = _context3.sent;
          res.status(201).json({
            status: "success",
            data: user,
            token: token
          });

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.login = asyncHandler(function _callee3(req, res, next) {
  var _req$body, password, email, user, token;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body = req.body, password = _req$body.password, email = _req$body.email;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.updateOne({
            email: email
          }, {
            $set: {
              active: true
            }
          }));

        case 3:
          _context4.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 5:
          user = _context4.sent;
          _context4.t0 = !user;

          if (_context4.t0) {
            _context4.next = 11;
            break;
          }

          _context4.next = 10;
          return regeneratorRuntime.awrap(user.correctPassword(password, user.password));

        case 10:
          _context4.t0 = !_context4.sent;

        case 11:
          if (!_context4.t0) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", next(new ApiError(" email or password is  incorrect", 401)));

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(createToken(user));

        case 15:
          token = _context4.sent;
          res.status(200).json({
            status: "success",
            data: user,
            token: token
          });

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.protect = asyncHandler(function _callee4(req, res, next) {
  var token, decoded, user;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
          }

          if (!(!token || token === "null")) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", next(new ApiError("token is not found or logged out,plz give me the token to access, you are not logged in ,plz log in to access ,plz login then set a token ", 401)));

        case 3:
          _context5.next = 5;
          return regeneratorRuntime.awrap(promisifyVerifyToken(token, process.env.JWT_SECRET));

        case 5:
          decoded = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            _id: decoded.id,
            tokens: {
              $in: [token]
            }
          }));

        case 8:
          user = _context5.sent;

          if (user) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", next(new ApiError("the user that belong to this token does not longer exist  ", 401)));

        case 11:
          ; // const iSpasswordChangedAfter = await passwordChangedAfter(user, decoded)
          //     if (iSpasswordChangedAfter) {
          //         return next(new ApiError("the password has changed ,plz try again to log in ", 401))
          //     };

          if (!user.passwordChangedAfter(decoded.iat)) {
            _context5.next = 14;
            break;
          }

          return _context5.abrupt("return", next(new ApiError("the password has changed ,plz try again to log in ", 401)));

        case 14:
          ;
          req.user = user;
          next();

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.forgotPassword = asyncHandler(function _callee5(req, res, next) {
  var user, resetTokenOutDb, message;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 2:
          user = _context6.sent;

          if (user) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", next(new ApiError("email address is not exist ", 404)));

        case 5:
          ;
          _context6.next = 8;
          return regeneratorRuntime.awrap(user.correctPasswordReset());

        case 8:
          resetTokenOutDb = _context6.sent;
          _context6.next = 11;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 11:
          message = "Hi : ".concat(user.name, " ,You are receiving this email from E-shop App  because you (or someone else) have requested the reset of the password for your account.\n\n") + "Please paste this into your browser to complete the process:\n\n" + "".concat(resetTokenOutDb, "\n\n") + "If you did not request this, please ignore this email and your password will remain unchanged.\n";
          _context6.prev = 12;
          _context6.next = 15;
          return regeneratorRuntime.awrap(new Email(user, "Token is valid for 10 minuts", message).sendEmail());

        case 15:
          res.status(200).json({
            status: "success",
            message: "token sent to email"
          });
          _context6.next = 26;
          break;

        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](12);
          user.passwordResetToken = undefined;
          user.passwordResetExpired = undefined;
          user.passwordResetTokenVerified = undefined;
          _context6.next = 25;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 25:
          return _context6.abrupt("return", next(new ApiError("there is an error in sending email", 500)));

        case 26:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[12, 18]]);
}); //////////////////////////////////////////////////////////////////

exports.verifyResetToken = asyncHandler(function _callee6(req, res, next) {
  var hashedtoken, user;
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          hashedtoken = crypto.createHash("sha256").update(req.body.resetToken).digest("hex");
          _context7.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            passwordResetToken: hashedtoken,
            passwordResetExpired: {
              $gt: Date.now()
            }
          }));

        case 3:
          user = _context7.sent;

          if (user) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", next(new ApiError("token is invalid or expired ", 400)));

        case 6:
          user.passwordResetTokenVerified = true;
          _context7.next = 9;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 9:
          res.status(200).json({
            status: "success",
            message: "verified"
          });

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.resetPassword = asyncHandler(function _callee7(req, res, next) {
  var user, token;
  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 2:
          user = _context8.sent;

          if (user) {
            _context8.next = 5;
            break;
          }

          return _context8.abrupt("return", next(new ApiError("there is no user for this email ", 404)));

        case 5:
          if (user.passwordResetTokenVerified) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt("return", next(new ApiError("this email  is not verified ", 400)));

        case 7:
          user.password = req.body.password;
          user.passwordConfirm = req.body.passwordConfirm;
          user.passwordResetToken = undefined;
          user.passwordResetExpired = undefined;
          user.passwordResetTokenVerified = undefined;
          _context8.next = 14;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 14:
          _context8.next = 16;
          return regeneratorRuntime.awrap(createToken(user));

        case 16:
          token = _context8.sent;
          res.status(200).json({
            status: "success",
            data: user,
            token: token
          });

        case 18:
        case "end":
          return _context8.stop();
      }
    }
  });
}); /////////////////////////////////////////////////////////

exports.logout = asyncHandler(function _callee8(req, res, next) {
  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          req.user.tokens.splice(req.user.tokens.indexOf(req.token), 1);
          _context9.next = 3;
          return regeneratorRuntime.awrap(req.user.save({
            validateBeforeSave: false
          }));

        case 3:
          res.status(200).json({
            status: 'success',
            message: "logged out "
          });

        case 4:
        case "end":
          return _context9.stop();
      }
    }
  });
});
exports.logoutAll = asyncHandler(function _callee9(req, res, next) {
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          req.user.tokens = [];
          _context10.next = 3;
          return regeneratorRuntime.awrap(req.user.save({
            validateBeforeSave: false
          }));

        case 3:
          res.status(200).json({
            status: 'success',
            message: "logged out All"
          });

        case 4:
        case "end":
          return _context10.stop();
      }
    }
  });
});

exports.allowedTo = function () {
  for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
    roles[_key] = arguments[_key];
  }

  return asyncHandler(function _callee10(req, res, next) {
    return regeneratorRuntime.async(function _callee10$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            if (roles.includes(req.user.role)) {
              _context11.next = 2;
              break;
            }

            return _context11.abrupt("return", next(new ApiError("you have not a permision to access ", 403)));

          case 2:
            next();

          case 3:
          case "end":
            return _context11.stop();
        }
      }
    });
  });
}; ///////////////////////////////////////////////