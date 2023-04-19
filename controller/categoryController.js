const Category = require("./../models/categoryModel");
const apiError = require("./../utils/apiError");
const { getAllModels, createModel, getModelById, updateModel, deleteModel } = require("./handlersFactory")
const sharp = require("sharp");
const asyncHandler=require("express-async-handler")
const {uploadSingelImage} = require("./../middlewares/uploadImageMiddleware");

exports.uploadCategoryImage =uploadSingelImage("image")
    

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {

if (!req.file) return next();

    const fileName = "category-" + req.file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + "jpeg"
        await sharp(req.file.buffer).resize(600, 600).toFormat("jpeg").jpeg({ quality: 90 })
            .toFile(`uploads/categories/${fileName}`);
        req.body.image = fileName;
    
    next();
    
       

});
//@desc create category
//@route post/api/v1/categories
//@access private
exports.createCategory = createModel(Category);

// @desc get list categories
// @route  get/api/v1/categories
// @access public
exports.getAllCategories = getAllModels(Category);

 

// @desc get Specific categories
// @route  get/api/v1/categories/:id
// @access public

exports.getCategoryById = getModelById(Category);
// @desc update Specific categories
// @route  update/api/v1/categories/:id
// @access private

exports.updateCategory = updateModel(Category);
// @desc delete Specific categories
// @route  delete/api/v1/categories/:id
// @access private
exports.deleteCategory = deleteModel(Category);
