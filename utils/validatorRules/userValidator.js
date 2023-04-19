const { check,body } = require("express-validator");
const validatorMiddleware = require("./../../middlewares/validatorMiddleware");
const slugify = require('slugify');
const User=require("./../../models/userModel")
const bcrypt=require("bcryptjs")
exports.getUserValidatorById = [
  check("id").isMongoId().withMessage("invalid user id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("user name requierd")
    .isLength({ min: 3 })
    .withMessage("too short user name")
    .isLength({ max: 32 })
    .withMessage("too long user name"),
  body("name").optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
        
  }),
 check("phone").optional().isMobilePhone(["ar-EG", "ar-SA"]).withMessage("enter valid mobile number about your country"),
  body("email").notEmpty().withMessage("user email is required ")
    .isEmail().withMessage("email is invalid").custom(async (val) => {
      const user = await User.findOne({ email: val })
      if (user) {
      throw new Error("E-mail already in use")
      };
      return true;
    }),
  check("password").notEmpty().withMessage("user password is required").isLength({ min: 8 })
    .withMessage("too short user password") .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("password confirmation is not valid  plz enter same paswords");
      }
        
        return true;
        
  }),
  body("passwordConfirm").notEmpty().withMessage("user passwordConfirm is required ")
   ,
  validatorMiddleware,
];

// exports.updateUserValidatorById = [
//   check("id").isMongoId().withMessage("invalid user id format"),
//   body("name").optional().custom((val, { req }) => {
//         req.body.slug = slugify(val);
//         return true;
        
//     }),
  
//   validatorMiddleware,
// ];
exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('image').optional(),
  check('role').optional(),
  validatorMiddleware,
];

exports.deleteUserValidatorById = [
  check("id").isMongoId().withMessage("invalid user id format"),
  validatorMiddleware,
];
exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),
  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id);

      if (!user) {
        throw new Error('There is no user for this id');
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error('Incorrect current password');
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      req.user=user
      return true;
    }),
  validatorMiddleware,
];

exports.changeMyPasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),
  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
  .custom(async (val, { req }) => {
      // 1) Verify current password
      
      const isCorrectPassword = await bcrypt.compare(
      req.body.currentPassword,
       req.user.password
      );
      if (!isCorrectPassword) {
        throw new Error('Incorrect current password');
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),
    
  validatorMiddleware,
];


exports.updateMeValidator = [
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email').optional()
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('image').optional(),
  check('role').isEmpty().withMessage("user can not update his role ,just admin do"),
    check('active').isEmpty().withMessage("user can not update his active status , just admin do"),

  validatorMiddleware,
];