"use strict";

var SubCategory = require("./../models/subCategoryModel");

var _require = require("./handlersFactory"),
    getAllModels = _require.getAllModels,
    createModel = _require.createModel,
    getModelById = _require.getModelById,
    updateModel = _require.updateModel,
    deleteModel = _require.deleteModel;

exports.setCategoryIdToBody = function (req, res, next) {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }

  next();
}; //@desc create subCategory
//@route post/api/v1/subCategories
//@access private


exports.createSubCategory = createModel(SubCategory); // @desc get list subcategories
// @route  get/api/v1/subcategories
// @access public

exports.getAllSubCategories = getAllModels(SubCategory); // @desc get Specific subcategories
// @route  get/api/v1/subcategories/:id
// @access public

exports.getSubCategoryById = getModelById(SubCategory); // @desc update Specific subcategories
// @route  update/api/v1/subcategories/:id
// @access private

exports.updateSubCategory = updateModel(SubCategory); // @desc delete Specific subcategories
// @route  delete/api/v1/subcategories/:id
// @access private

exports.deleteSubCategory = deleteModel(SubCategory);