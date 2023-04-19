const { check,body } = require("express-validator");
const validatorMiddleware = require("./../../middlewares/validatorMiddleware");
const slugify = require('slugify');
const User=require("./../../models/userModel")
const bcrypt=require("bcryptjs");
const { Error } = require("mongoose");
const crypto = require("crypto");

exports.signUpUserValidator = [
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
exports.loginUserValidator = [
  body("email").notEmpty().withMessage("user email is required ")
    .isEmail().withMessage("email is invalid"),
    //.custom(async (val,{req}) => {
    //   const user = await User.findOne({ email: val })
    //   if (!user) {
    //   throw new Error("E-mail not exist, from validator")
    //   };
    //   req.user = user;
    //   return true;
    // }),
  
  check("password").notEmpty().withMessage("user password is required"),
  //   .custom(async (val, { req }) => {
  //   if (req.user) {
  //     const isCorrectPassword = await req.user.correctPassword(val, req.user.password);
  //     if (!isCorrectPassword) {
  //       throw new Error(`incorrect password plz enter the correct password ,from validator`);
  //     }
  //   }
      
        
  //       return true;
        
  // }),
   
  validatorMiddleware,
];

exports.resetPasswordValidator = [ body("email").notEmpty().withMessage("user email is required ")
    .isEmail().withMessage("email is invalid"),
  check("password").notEmpty().withMessage("user password is required").isLength({ min: 8 })
    .withMessage("too short user password") .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("password confirmation is not valid  plz enter same paswords");
      }
        
        return true;
        
  }),
  body("passwordConfirm").notEmpty().withMessage("user passwordConfirm is required ")

, validatorMiddleware]



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
      return true;
    }),
  validatorMiddleware,
];