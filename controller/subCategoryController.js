const SubCategory = require("./../models/subCategoryModel");

const {getAllModels,createModel,getModelById,updateModel,deleteModel}=require("./handlersFactory")

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

exports.createfilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
//@desc create subCategory
//@route post/api/v1/subCategories
//@access private
exports.createSubCategory = createModel(SubCategory);

// @desc get list subcategories
// @route  get/api/v1/subcategories
// @access public
exports.getAllSubCategories =getAllModels(SubCategory)


// @desc get Specific subcategories
// @route  get/api/v1/subcategories/:id
// @access public

exports.getSubCategoryById =getModelById(SubCategory)

// @desc update Specific subcategories
// @route  update/api/v1/subcategories/:id
// @access private

exports.updateSubCategory =updateModel(SubCategory)

// @desc delete Specific subcategories
// @route  delete/api/v1/subcategories/:id
// @access private
exports.deleteSubCategory = deleteModel(SubCategory);
