"use strict";

var _require = require("express-validator"),
    check = _require.check;

var validatorMiddleware = require("./../../middlewares/validatorMiddleware");

var slugify = require("slugify");

exports.createSubCategoryValidator = [check("name").notEmpty().withMessage("subCategory name requierd").isLength({
  min: 2
}).withMessage("too short subCategory name").isLength({
  max: 32
}).withMessage("too long subCategory name").custom(function (val, _ref) {
  var req = _ref.req;
  req.body.slug = slugify(val);
}), check("category").notEmpty().withMessage("subCategory must belong to category").isMongoId().withMessage("invalid Category id format"), validatorMiddleware];
exports.getSubCategoryValidatorById = [check("id").isMongoId().withMessage("invalid subCategory id format"), validatorMiddleware];
exports.updateSubCategoryValidatorById = [check("id").notEmpty().withMessage("id must be requierd").isMongoId().withMessage("invalid subCategory id format"), check("name").optional().custom(function (val, _ref2) {
  var req = _ref2.req;
  req.body.slug = slugify(val);
}), validatorMiddleware];
exports.deleteSubCategoryValidatorById = [check("id").notEmpty().withMessage("id must be requierd").isMongoId().withMessage("invalid subCategory id format"), validatorMiddleware];