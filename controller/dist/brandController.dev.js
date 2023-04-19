"use strict";

var Brand = require("./../models/brandModel");

var _require = require("./handlersFactory"),
    getAllModels = _require.getAllModels,
    createModel = _require.createModel,
    getModelById = _require.getModelById,
    updateModel = _require.updateModel,
    deleteModel = _require.deleteModel;

var sharp = require("sharp");

var asyncHandler = require("express-async-handler");

var _require2 = require("./../middlewares/uploadImageMiddleware"),
    uploadSingelImage = _require2.uploadSingelImage;

exports.uploadBrandImage = uploadSingelImage("image");
exports.resizeBrandImage = asyncHandler(function _callee(req, res, next) {
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
          fileName = "brand-" + req.file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + "jpeg";
          _context.next = 5;
          return regeneratorRuntime.awrap(sharp(req.file.buffer).resize(600, 600).toFormat("jpeg").jpeg({
            quality: 90
          }).toFile("uploads/brands/".concat(fileName)));

        case 5:
          req.body.image = fileName;
          next();

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}); //@desc create brand
//@route post/api/v1/brand
//@access private

exports.createBrand = createModel(Brand); // @desc get list brands
// @route  get/api/v1/brands
// @access public

exports.getAllBrands = getAllModels(Brand); // @desc get Specific brand
// @route  get/api/v1/brands/:id
// @access public

exports.getBrandById = getModelById(Brand); // @desc update Specific brands
// @route  update/api/v1/brands/:id
// @access private

exports.updateBrand = updateModel(Brand); // @desc delete Specific brand
// @route  delete/api/v1/brands/:id
// @access private

exports.deleteBrand = deleteModel(Brand);