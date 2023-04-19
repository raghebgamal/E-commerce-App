const { check,body } = require("express-validator");
const validatorMiddleware = require("./../../middlewares/validatorMiddleware");
const  slugify = require('slugify');

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name requierd")
    .isLength({ min: 2 })
    .withMessage("too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("too long subCategory name"),
   body("name").optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
        
    }),
  check("category")
    .notEmpty()
    .withMessage("subCategory must belong to category")
    .isMongoId()
    .withMessage("invalid Category id format"),
  
  validatorMiddleware,
];

exports.getSubCategoryValidatorById = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  
  validatorMiddleware,
];

exports.updateSubCategoryValidatorById = [
  check("id")
    .notEmpty()
    .withMessage("id must be requierd")
    .isMongoId()
    .withMessage("invalid subCategory id format"),
   body("name").optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
        
    }),
  
  validatorMiddleware,
];

exports.deleteSubCategoryValidatorById = [
  check("id")
    .notEmpty()
    .withMessage("id must be requierd")
    .isMongoId()
    .withMessage("invalid subCategory id format"),
  validatorMiddleware,
];
