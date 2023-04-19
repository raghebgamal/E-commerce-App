const { check,body } = require("express-validator");
const validatorMiddleware = require("./../../middlewares/validatorMiddleware");
const  slugify = require('slugify');

exports.getBrandValidatorById = [
  check("id").isMongoId().withMessage("invalid brand id format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("brand name requierd")
    .isLength({ min: 3 })
    .withMessage("too short brand name")
    .isLength({ max: 32 })
    .withMessage("too long brand name"),
  body("name").optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
        
    }),
  validatorMiddleware,
];

exports.updateBrandValidatorById = [
  check("id").isMongoId().withMessage("invalid brand id format"),
  body("name").optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
        
    }),
  
  validatorMiddleware,
];

exports.deleteBrandValidatorById = [
  check("id").isMongoId().withMessage("invalid brand id format"),
  validatorMiddleware,
];
