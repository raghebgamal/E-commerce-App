const Product = require("./../models/productModel");
const asyncHandler = require("express-async-handler")
const sharp = require("sharp");

const { createModel,
  getAllModels,
  getModelById,
  updateModel,
  deleteModel } = require("./handlersFactory");
  const {uploadMixlImage} = require("./../middlewares/uploadImageMiddleware");

//@desc create product
//@route post/api/v1/categories
//@access private
const arrayOfFields = [{
  name: "imageCover", maxCount: 1
},
{
  name: "images", maxCount: 5
    
}];
exports.uploadProductImage = uploadMixlImage(arrayOfFields);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files||!req.files.imageCover || !req.files.images) return next();

    if (!req.files) return next();
    const fileName = "product-" +'ImageCover-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + "jpeg"
  req.body.imageCover = fileName;
  await sharp(req.files.imageCover[0].buffer).resize(2000, 1333).toFormat("jpeg").jpeg({ quality: 90 })
    .toFile(`uploads/products/${fileName}`);
  
      
    req.body.images = [];
    
    await Promise.all(req.files.images.map(async (el, i) => {
        
    const fileName = "product-"+(i+1)+'-Image-'+ Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + "jpeg"
        await sharp(el.buffer).resize(600, 600).toFormat("jpeg").jpeg({ quality: 90 })
            .toFile(`uploads/products/${fileName}`);
        req.body.images.push(fileName)
    })
    );

    next();
    
       

});
exports.createProduct = createModel(Product);
// @desc get list categories
// @route  get/api/v1/categories
// @access public

exports.getAllProducts = getAllModels(Product);

// @desc get Specific categories
// @route  get/api/v1/categories/:id
// @access public

exports.getProductById = getModelById(Product);


// @desc update Specific categories
// @route  update/api/v1/categories/:id
// @access private
exports.updateProduct=updateModel(Product)

// @desc delete Specific categories
// @route  delete/api/v1/categories/:id
// @access private
exports.deleteProduct = deleteModel(Product);
