"use strict";

var express = require("express");

var router = express.Router({
  mergeParams: true
});

var _require = require("./../controller/subCategoryController"),
    createSubCategory = _require.createSubCategory,
    getAllSubCategories = _require.getAllSubCategories,
    getSubCategoryById = _require.getSubCategoryById,
    updateSubCategory = _require.updateSubCategory,
    deleteSubCategory = _require.deleteSubCategory,
    setCategoryIdToBody = _require.setCategoryIdToBody,
    createfilterObject = _require.createfilterObject;

var _require2 = require("./../utils/validatorRules/subCategoryValidator"),
    createSubCategoryValidator = _require2.createSubCategoryValidator,
    getSubCategoryValidatorById = _require2.getSubCategoryValidatorById,
    updateSubCategoryValidatorById = _require2.updateSubCategoryValidatorById,
    deleteSubCategoryValidatorById = _require2.deleteSubCategoryValidatorById;

router.route("/").post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory).get(getAllSubCategories);
router.route("/:id").get(getSubCategoryValidatorById, getSubCategoryById).patch(updateSubCategoryValidatorById, updateSubCategory)["delete"](deleteSubCategoryValidatorById, deleteSubCategory);
module.exports = router;