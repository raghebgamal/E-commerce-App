"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require("express-validator"),
    check = _require.check;

var validatorMiddleware = require("./../../middlewares/validatorMiddleware");

var Category = require("./../../models/categoryModel");

var SubCategory = require("./../../models/subCategoryModel");

exports.getProductValidatorById = [check("id").isMongoId().withMessage("invalid product id format"), validatorMiddleware];
exports.createProductValidator = [check("title").notEmpty().withMessage("product name requierd").isLength({
  min: 3
}).withMessage("too short product title").isLength({
  max: 100
}).withMessage("too long product title"), check("description").notEmpty().withMessage("descripton is requierd to the product").isLength({
  max: 2000
}).withMessage("too long description"), check("quantity").notEmpty().withMessage("product quantity is required").isNumeric().withMessage("product quantity must be a number"), check("sold").optional().isNumeric().withMessage("product sold must be a number"), check("price").notEmpty().withMessage("product price is required").isNumeric().withMessage("product price must be a number").isLength({
  max: 200000
}).withMessage("very high price"), check("priceAfterDiscount").optional().isNumeric().withMessage("product priceAfterDiscount must be a number").toFloat().custom(function (value, _ref) {
  var req = _ref.req;

  if (req.body.price < value || req.body.price === value) {
    throw new Error("priceAfterDiscount must be lower than price");
  }

  return true;
}), check("category").notEmpty().withMessage("product must be belong to category").isMongoId().withMessage("invalid category id format").custom(function (categoryId, _ref2) {
  var req = _ref2.req;
  return Category.findById(categoryId).then(function (category) {
    if (!category) {
      return Promise.reject(new Error("no category for this id :".concat(categoryId, " ,found in database")));
    }
  });
}), check("colors").optional().isArray().withMessage("colors should be array"), check("images").isArray().withMessage("images should be array").notEmpty().withMessage("product images is required"), check("imageCover").notEmpty().withMessage("product imageCover is required"), check("subCategories").optional().isMongoId().withMessage("invalid id").custom(function _callee(subCategoriesIds, _ref3) {
  var req, unique_SubCategoriesIds, subCategories, id;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          req = _ref3.req;
          unique_SubCategoriesIds = _toConsumableArray(new Set(subCategoriesIds));
          _context.next = 4;
          return regeneratorRuntime.awrap(SubCategory.find({
            _id: {
              $exists: true,
              $in: unique_SubCategoriesIds
            }
          }));

        case 4:
          subCategories = _context.sent;
          id = unique_SubCategoriesIds.find(function (id) {
            return !subCategories.map(function (el) {
              return el._id.toString();
            }).includes(id);
          });

          if (!(subCategories.length !== unique_SubCategoriesIds.length)) {
            _context.next = 8;
            break;
          }

          throw new Error(" no subCategory for this id:".concat(id, " ,found in db"));

        case 8:
          return _context.abrupt("return", true);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}).custom(function _callee2(subCategoriesIds, _ref4) {
  var req, unique_SubCategoriesIds, subCategories, checker;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          req = _ref4.req;
          unique_SubCategoriesIds = _toConsumableArray(new Set(subCategoriesIds));
          _context2.next = 4;
          return regeneratorRuntime.awrap(SubCategory.find({
            category: req.body.category
          }));

        case 4:
          subCategories = _context2.sent;
          checker = unique_SubCategoriesIds.every(function (id) {
            return subCategories.map(function (el) {
              return el._id.toString();
            }).includes(id);
          });

          if (checker) {
            _context2.next = 8;
            break;
          }

          throw new Error("there is a subCategory not belong to this category id".concat(req.body.category, " "));

        case 8:
          return _context2.abrupt("return", true);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
}), check("brand").optional().isMongoId().withMessage("invalid id"), check("ratingsAverage").optional().isNumeric().withMessage("ratingsAverage must be a number").isLength({
  min: 1
}).withMessage("rating must be above or equal 1").isLength({
  max: 5
}).withMessage("rating must be below or equal 5"), check("ratingsQuantity").optional().isNumeric().withMessage("ratingsQuantity must be a number"), validatorMiddleware];
exports.updateProductValidatorById = [check("id").isMongoId().withMessage("invalid product id format"), validatorMiddleware];
exports.deleteProductValidatorById = [check("id").isMongoId().withMessage("invalid product id format"), validatorMiddleware];