"use strict";

var User = require("./../models/userModel");

var Factory = require("./handlersFactory");

var sharp = require("sharp");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var createToken = require("./../utils/generateToken");

var asyncHandler = require("express-async-handler");

var _require = require("./../middlewares/uploadImageMiddleware"),
    uploadSingelImage = _require.uploadSingelImage;

var apiError = require("./../utils/apiError");

var Email = require("./../utils/email/sendEmail");

exports.uploadUserImage = uploadSingelImage("image");
exports.resizeUserImage = asyncHandler(function _callee(req, res, next) {
  var fileName;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.file) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          fileName = "user-" + req.file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + "jpeg";
          _context.next = 5;
          return regeneratorRuntime.awrap(sharp(req.file.buffer).resize(600, 600).toFormat("jpeg").jpeg({
            quality: 90
          }).toFile("uploads/users/".concat(fileName)));

        case 5:
          req.body.image = fileName;
          next();

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});

var filterdObj = function filterdObj(obj) {
  for (var _len = arguments.length, allowedfeilds = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    allowedfeilds[_key - 1] = arguments[_key];
  }

  var newobj = {};
  Object.keys(obj).forEach(function (el) {
    if (allowedfeilds.includes(el)) {
      newobj[el] = obj[el];
    }
  });
  return newobj;
};

exports.getMe = asyncHandler(function _callee2(req, res, next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          req.params.id = req.user._id;
          next();

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}); ///////////////////////////////////

exports.deleteMe = asyncHandler(function _callee3(req, res, next) {
  var tokens;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          tokens = [];
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, {
            active: false,
            tokens: tokens
          }, {
            "new": true
          }));

        case 3:
          res.status(200).json({
            status: "success",
            message: "user deactivated"
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.updateMe = asyncHandler(function _callee4(req, res, next) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          req.params.id = req.user._id;
          next();

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.updateUser = asyncHandler(function _callee5(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!(req.body.password || req.body.passwordConfirm)) {
            _context5.next = 2;
            break;
          }

          return _context5.abrupt("return", next(new apiError("plz use update password handler ", 404)));

        case 2:
          _context5.next = 4;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.params.id, filterdObj(req.body, "slug", "name", "email", "phone", "role", "image"), {
            "new": true,
            runValidators: true
          }));

        case 4:
          user = _context5.sent;

          if (user) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", next(new apiError("no ".concat(User.modelName, " for this id : ").concat(id, " to update"), 404)));

        case 7:
          res.status(200).json({
            status: "success",
            data: user
          });

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.updatePassword = asyncHandler(function _callee6(req, res, next) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          req.user.password = req.body.password;
          req.user.passwordConfirm = req.body.passwordConfirm;
          _context6.next = 4;
          return regeneratorRuntime.awrap(req.user.save({
            validateBeforeSave: false
          }));

        case 4:
          //     const user = await User.findByIdAndUpdate(req.params.id,
          //             {
          //                 password: await bcrypt.hash(req.body.password, 12),
          //             passwordChangedAt:Date.now()},
          //             {
          //     new: true,
          //     runValidators: true,
          //   });
          //   if (!user) {
          //     return next(new apiError(`no ${User.modelName} for this id : ${id} to update`, 404));
          //   }
          res.status(200).json({
            status: "success",
            data: req.user
          });

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.updateMyPassword = asyncHandler(function _callee7(req, res, next) {
  var token;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          req.user.password = req.body.password;
          req.user.passwordConfirm = req.body.passwordConfirm;
          _context7.next = 4;
          return regeneratorRuntime.awrap(req.user.save({
            validateBeforeSave: false
          }));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(createToken(req.user));

        case 6:
          token = _context7.sent;
          res.status(200).json({
            status: "success",
            data: req.user,
            token: token
          });

        case 8:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.createUser = Factory.createModel(User);
exports.getAllUsers = Factory.getAllModels(User);
exports.getUserById = Factory.getModelById(User); //exports.updateUser = Factory.updateModel(User);

exports.deleteUser = Factory.deleteModel(User);