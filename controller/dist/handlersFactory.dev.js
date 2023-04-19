"use strict";

var asyncHandler = require("express-async-handler"); //catch error from async then pass to express error hendler


var apiError = require("./../utils/apiError");

var ApiFeature = require("./../utils/apiFeature"); //@desc create product
//@route post/api/v1/categories
//@access private


exports.createModel = function (Model) {
  return asyncHandler(function _callee(req, res, next) {
    var model;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(Model.create(req.body));

          case 2:
            model = _context.sent;
            res.status(201).json({
              status: "success",
              data: model
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}; // @desc get list categories
// @route  get/api/v1/categories
// @access public


exports.getAllModels = function (Model) {
  return asyncHandler(function _callee2(req, res) {
    var filter, apiFeatures, buildQueryMongoose, paginationResult, models;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            filter = {};

            if (req.filterObj) {
              filter = req.filterObj;
            }

            _context2.t0 = new ApiFeature(Model.find(filter), req.query).filtering();
            _context2.next = 5;
            return regeneratorRuntime.awrap(Model.countDocuments());

          case 5:
            _context2.t1 = _context2.sent;
            _context2.t2 = Model.modelName;
            apiFeatures = _context2.t0.paginate.call(_context2.t0, _context2.t1).sorting().fields().search(_context2.t2);
            buildQueryMongoose = apiFeatures.buildQueryMongoose, paginationResult = apiFeatures.paginationResult;
            _context2.next = 11;
            return regeneratorRuntime.awrap(buildQueryMongoose);

          case 11:
            models = _context2.sent;
            res.status(200).json({
              status: "success",
              results: models.length,
              paginationResult: paginationResult,
              data: models
            });

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
}; // // @desc get Specific categories
// // @route  get/api/v1/categories/:id
// // @access public


exports.getModelById = function (Model) {
  return asyncHandler(function _callee3(req, res, next) {
    var id, model;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            _context3.next = 3;
            return regeneratorRuntime.awrap(Model.findById(id));

          case 3:
            model = _context3.sent;

            if (model) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", next(new apiError("no ".concat(Model.modelName, " for this id : ").concat(id), 404)));

          case 6:
            res.status(200).json({
              status: "success",
              data: model
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
}; // // @desc update Specific categories
// // @route  update/api/v1/categories/:id
// // @access private


exports.updateModel = function (Model) {
  return asyncHandler(function _callee4(req, res, next) {
    var id, model;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            _context4.next = 3;
            return regeneratorRuntime.awrap(Model.findByIdAndUpdate(id, req.body, {
              "new": true,
              runValidators: true
            }));

          case 3:
            model = _context4.sent;

            if (model) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", next(new apiError("no ".concat(Model.modelName, " for this id : ").concat(id, " to update"), 404)));

          case 6:
            res.status(200).json({
              status: "success",
              data: model
            });

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
}; // // @desc delete Specific categories
// // @route  delete/api/v1/categories/:id
// // @access private


exports.deleteModel = function (Model) {
  return asyncHandler(function _callee5(req, res, next) {
    var id, model;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id;
            _context5.next = 3;
            return regeneratorRuntime.awrap(Model.findByIdAndDelete(id));

          case 3:
            model = _context5.sent;

            if (model) {
              _context5.next = 6;
              break;
            }

            return _context5.abrupt("return", next(new apiError("no ".concat(Model.modelName, " for this id : ").concat(id, " to delete"), 404)));

          case 6:
            res.status(204).json({
              status: "success",
              message: "deleted"
            });

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
};