"use strict";

var Category = require("./../models/categoryModel");

var apiError = require("./../utils/apiError");

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

exports.uploadCategoryImage = uploadSingelImage("image");
exports.resizeCategoryImage = asyncHandler(function _callee(req, res, next) {
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
          fileName = "category-" + req.file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + "jpeg";
          _context.next = 5;
          return regeneratorRuntime.awrap(sharp(req.file.buffer).resize(600, 600).toFormat("jpeg").jpeg({
            quality: 90
          }).toFile("uploads/categories/".concat(fileName)));

        case 5:
          req.body.image = fileName;
          next();

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}); //@desc create category
//@route post/api/v1/categories
//@access private

exports.createCategory = createModel(Category); // @desc get list categories
// @route  get/api/v1/categories
// @access public

exports.getAllCategories = getAllModels(Category); // @desc get Specific categories
// @route  get/api/v1/categories/:id
// @access public

exports.getCategoryById = getModelById(Category); // @desc update Specific categories
// @route  update/api/v1/categories/:id
// @access private

exports.updateCategory = updateModel(Category); // @desc delete Specific categories
// @route  delete/api/v1/categories/:id
// @access private

exports.deleteCategory = deleteModel(Category);