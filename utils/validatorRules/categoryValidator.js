
const { check,body } = require('express-validator');
const validatorMiddleware = require("./../../middlewares/validatorMiddleware");
const  slugify = require('slugify');
    
exports.getCategoryValidatorById = [check("id").isMongoId().withMessage("invalid category id format"),
    validatorMiddleware];
   
exports.createCategoryValidator = [check("name").notEmpty().withMessage("category name requierd")
    .isLength({ min: 3 }).withMessage("too short category name")
    .isLength({ max: 32 }).withMessage("too long category name"),
    body("name").optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
        
    }),
    validatorMiddleware];

exports.updateCategoryValidatorById = [
    check("id").isMongoId().withMessage("invalid category id format"),
   body("name").optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
        
    }),
    
    validatorMiddleware];

    exports.deleteCategoryValidatorById = [check("id").isMongoId().withMessage("invalid category id format"),
    validatorMiddleware]

