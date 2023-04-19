const { check } = require("express-validator");
const validatorMiddleware = require("./../../middlewares/validatorMiddleware");
const Category = require("./../../models/categoryModel");
const SubCategory = require("./../../models/subCategoryModel");

exports.getProductValidatorById = [
  check("id").isMongoId().withMessage("invalid product id format"),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("product name requierd")
    .isLength({ min: 3 })
    .withMessage("too short product title")
    .isLength({ max: 100 })
    .withMessage("too long product title"),
  check("description")
    .notEmpty()
    .withMessage("descripton is requierd to the product")
    .isLength({ max: 2000 })
    .withMessage("too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("product price must be a number")
    .isLength({ max: 200000 })
    .withMessage("very high price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price < value || req.body.price === value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("product must be belong to category")
    .isMongoId()
    .withMessage("invalid category id format")
    .custom((categoryId, { req }) => {
      return Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(
              `no category for this id :${categoryId} ,found in database`
            )
          );
        }
      });
    }),

  check("colors").optional().isArray().withMessage("colors should be array"),
  check("images").isArray().withMessage("images should be array")
    .notEmpty().withMessage("product images is required"),
  check("imageCover").notEmpty().withMessage("product imageCover is required"),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (subCategoriesIds, { req }) => {
      const unique_SubCategoriesIds = [...new Set(subCategoriesIds)];
      const subCategories = await SubCategory.find({
        _id: { $exists: true, $in: unique_SubCategoriesIds },
      });

      const id = unique_SubCategoriesIds.find((id) => {
        return !subCategories
          .map((el) => {
            return el._id.toString();
          })
          .includes(id);
      });

      if (subCategories.length !== unique_SubCategoriesIds.length) {
        throw new Error(` no subCategory for this id:${id} ,found in db`);
      }

      return true;
    })
    .custom(async (subCategoriesIds, { req }) => {
      const unique_SubCategoriesIds = [...new Set(subCategoriesIds)];
      const subCategories = await SubCategory.find({
        category: req.body.category,
      });
      const checker = unique_SubCategoriesIds.every((id) => {
        return subCategories
          .map((el) => {
            return el._id.toString();
          })
          .includes(id);
      });
      if (!checker) {
        throw new Error(
          `there is a subCategory not belong to this category id${req.body.category} `
        );
      }

      return true;
    }),
  check("brand").optional().isMongoId().withMessage("invalid id"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("rating must be above or equal 1")
    .isLength({ max: 5 })
    .withMessage("rating must be below or equal 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validatorMiddleware,
];

exports.updateProductValidatorById = [
  check("id").isMongoId().withMessage("invalid product id format"),
  validatorMiddleware,
];

exports.deleteProductValidatorById = [
  check("id").isMongoId().withMessage("invalid product id format"),
  validatorMiddleware,
];
