const User = require("./../models/userModel");
const Factory = require("./handlersFactory");
const sharp = require("sharp");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const createToken = require("./../utils/generateToken");
const asyncHandler = require("express-async-handler");
const {uploadSingelImage} = require("./../middlewares/uploadImageMiddleware");
const apiError = require("./../utils/apiError")
  const Email = require("./../utils/email/sendEmail");

exports.uploadUserImage = uploadSingelImage("image");

exports.resizeUserImage = asyncHandler(async (req, res, next) => {
    if (!req.file) return next();
    
        const fileName = "user-" + req.file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + "jpeg"
        await sharp(req.file.buffer).resize(600, 600).toFormat("jpeg").jpeg({ quality: 90 })
            .toFile(`uploads/users/${fileName}`);
        req.body.image = fileName;
    
    next();
    
       

});



const filterdObj = (obj, ...allowedfeilds) => {
    const newobj = {};
    Object.keys(obj).forEach(el => {
        if (allowedfeilds.includes(el)) {
            newobj[el] = obj[el];
    }
})

    return newobj;
}




exports.getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;

  next();

  
   
});
///////////////////////////////////
exports.deleteMe = asyncHandler(async (req, res, next) => {
const tokens = [];
 await User.findByIdAndUpdate(req.user._id, { active: false,tokens }, { new: true });
  
    res.status(200).json({ status: "success",message:"user deactivated"});

})

exports.updateMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;

  next();

  
   
});


exports.updateUser = asyncHandler(async (req, res, next) => {

    if (req.body.password || req.body.passwordConfirm) { 
        return next(new apiError(`plz use update password handler `, 404))
    }
  const user = await User.findByIdAndUpdate( req.params.id , filterdObj(req.body,"slug","name","email","phone","role","image"), {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new apiError(`no ${User.modelName} for this id : ${id} to update`, 404));
  }
  res.status(200).json({ status: "success", data: user });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
    
   

    req.user.password = req.body.password;
   req.user.passwordConfirm = req.body.passwordConfirm;
  await req.user.save({ validateBeforeSave: false });


//     const user = await User.findByIdAndUpdate(req.params.id,
//             {
//                 password: await bcrypt.hash(req.body.password, 12),
//             passwordChangedAt:Date.now()},
//             {
//     new: true,
//     runValidators: true,
//   });
//   if (!user) {
//     return next(new apiError(`no ${User.modelName} for this id : ${id} to update`, 404));
//   }



  res.status(200).json({ status: "success", data:req.user });
});

exports.updateMyPassword = asyncHandler(async (req, res, next) => {
    
    req.user.password = req.body.password;
   req.user.passwordConfirm = req.body.passwordConfirm;
  await req.user.save({ validateBeforeSave: false });
  const token = await createToken(req.user)
  res.status(200).json({ status: "success", data:req.user ,token});
});

exports.createUser = Factory.createModel(User);


exports.getAllUsers =Factory. getAllModels(User);



exports.getUserById = Factory.getModelById(User);




//exports.updateUser = Factory.updateModel(User);


exports.deleteUser = Factory.deleteModel(User);

