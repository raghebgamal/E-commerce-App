const Brand = require("./../models/brandModel");
const {getAllModels,createModel,getModelById,updateModel,deleteModel}=require("./handlersFactory")
const sharp = require("sharp");
const asyncHandler=require("express-async-handler")
const {uploadSingelImage} = require("./../middlewares/uploadImageMiddleware");

exports.uploadBrandImage = uploadSingelImage("image");

exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
    if (!req.file) return next();
    
        const fileName = "brand-" + req.file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + "jpeg"
        await sharp(req.file.buffer).resize(600, 600).toFormat("jpeg").jpeg({ quality: 90 })
            .toFile(`uploads/brands/${fileName}`);
        req.body.image = fileName;
    
    next();
    
       

});

//@desc create brand
//@route post/api/v1/brand
//@access private
exports.createBrand = createModel(Brand);

// @desc get list brands
// @route  get/api/v1/brands
// @access public
exports.getAllBrands = getAllModels(Brand);


// @desc get Specific brand
// @route  get/api/v1/brands/:id
// @access public

exports.getBrandById = getModelById(Brand);


// @desc update Specific brands
// @route  update/api/v1/brands/:id
// @access private

exports.updateBrand = updateModel(Brand);

// @desc delete Specific brand
// @route  delete/api/v1/brands/:id
// @access private
exports.deleteBrand = deleteModel(Brand);

