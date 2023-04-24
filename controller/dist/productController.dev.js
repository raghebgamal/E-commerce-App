"use strict";

var Product = require("./../models/productModel");

var asyncHandler = require("express-async-handler");

var sharp = require("sharp");

var _require = require("./handlersFactory"),
    createModel = _require.createModel,
    getAllModels = _require.getAllModels,
    getModelById = _require.getModelById,
    updateModel = _require.updateModel,
    deleteModel = _require.deleteModel;

var _require2 = require("./../middlewares/uploadImageMiddleware"),
    uploadMixlImage = _require2.uploadMixlImage; //@desc create product
//@route post/api/v1/categories
//@access private


var arrayOfFields = [{
  name: "imageCover",
  maxCount: 1
}, {
  name: "images",
  maxCount: 5
}];
exports.uploadProductImage = uploadMixlImage(arrayOfFields);
exports.resizeProductImages = asyncHandler(function _callee2(req, res, next) {
  var fileName;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(!req.files || !req.files.imageCover || !req.files.images)) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", next());

        case 2:
          if (req.files) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", next());

        case 4:
          fileName = "product-" + 'ImageCover-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + "jpeg";
          req.body.imageCover = fileName;
          _context2.next = 8;
          return regeneratorRuntime.awrap(sharp(req.files.imageCover[0].buffer).resize(2000, 1333).toFormat("jpeg").jpeg({
            quality: 90
          }).toFile("uploads/products/".concat(fileName)));

        case 8:
          req.body.images = [];
          _context2.next = 11;
          return regeneratorRuntime.awrap(Promise.all(req.files.images.map(function _callee(el, i) {
            var fileName;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    fileName = "product-" + (i + 1) + '-Image-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + "jpeg";
                    _context.next = 3;
                    return regeneratorRuntime.awrap(sharp(el.buffer).resize(600, 600).toFormat("jpeg").jpeg({
                      quality: 90
                    }).toFile("uploads/products/".concat(fileName)));

                  case 3:
                    req.body.images.push(fileName);

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 11:
          next();

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.createProduct = createModel(Product); // @desc get list categories
// @route  get/api/v1/categories
// @access public

exports.getAllProducts = getAllModels(Product); // @desc get Specific categories
// @route  get/api/v1/categories/:id
// @access public

exports.getProductById = getModelById(Product, "reviews"); // @desc update Specific categories
// @route  update/api/v1/categories/:id
// @access private

exports.updateProduct = updateModel(Product); // @desc delete Specific categories
// @route  delete/api/v1/categories/:id
// @access private

exports.deleteProduct = deleteModel(Product);