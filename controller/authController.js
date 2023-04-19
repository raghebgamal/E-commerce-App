const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const ApiError = require("./../utils/apiError");
const asyncHandler = require("express-async-handler")
const Email = require("./../utils/email/sendEmail");
const crypto = require("crypto");
const createToken = require("./../utils/generateToken");


const promisifyVerifyToken = async (token, secretKey) => {
    return jwt.verify(token, secretKey);
    
};
// const passwordChangedAfter=async(user,decoded)=>{
//     if (user.passwordChangedAt) {
//         const changedtime = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
//          return decoded.iat < changedtime;
//     }
//     return false
//     }


exports.activeMe = asyncHandler(async (req, res, next) => {
  const user= await User.updateOne({ email: req.body.email }, { $set: { active: true } });
    await new Email(user, "activation status",`Hi ,${user.name} your account activated`).sendEmail();
    res.status(200).json({ status: "success", message:"your account activated" });
});

exports.sign_up = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    const token =await createToken(user);
    
    res.status(201).json({ status: "success", data: user, token });

    
});
exports.login = asyncHandler(async (req, res, next) => {
    const { password, email } = req.body;
await User.updateOne({ email }, { $set: { active: true } });
    const user = await User.findOne({ email });

    if (!user||!(await user.correctPassword(password, user.password))) {
     return next(new ApiError(" email or password is  incorrect", 401));
    }
    


    
    const token=await createToken(user);
    
  res.status(200).json({ status: "success", data:user,token });

    
})


exports.protect = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token || token === "null") {
        return next(new ApiError("token is not found or logged out,plz give me the token to access, you are not logged in ,plz log in to access ,plz login then set a token ", 401))
    }
    const decoded = await promisifyVerifyToken(token, process.env.JWT_SECRET);

    //const user = await User.findById(decoded.id);
    
    const user = await User.findOne({ _id: decoded.id, tokens: { $in: [token] } });
    if (!user) {
        return next(new ApiError("the user that belong to this token does not longer exist  ", 401))
    };

    // const iSpasswordChangedAfter = await passwordChangedAfter(user, decoded)
    //     if (iSpasswordChangedAfter) {
    //         return next(new ApiError("the password has changed ,plz try again to log in ", 401))
    //     };

    
    if (user.passwordChangedAfter(decoded.iat)) {
        return next(new ApiError("the password has changed ,plz try again to log in ", 401))

    };


    req.user = user
    next();
    

});



exports.forgotPassword = asyncHandler(async (req, res, next) => { 


    const user = await User.findOne({ email: req.body.email });
    if (!user) {
         return next(new ApiError("email address is not exist ", 404));
    };

    
        const resetTokenOutDb = await user.correctPasswordReset();
        await user.save({ validateBeforeSave: false });
        const message = `Hi : ${user.name} ,You are receiving this email from E-shop App  because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please paste this into your browser to complete the process:\n\n` +
            `${resetTokenOutDb}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`;
    try{
        await new Email(user, "Token is valid for 10 minuts", message).sendEmail();
          res.status(200).json({ status: "success", message: "token sent to email" });
    } catch (err) {

        user.passwordResetToken = undefined;
        user.passwordResetExpired = undefined;
        user.passwordResetTokenVerified = undefined;
        await user.save({ validateBeforeSave: false });
        return  next(new ApiError("there is an error in sending email", 500));
 }
  

});


//////////////////////////////////////////////////////////////////
exports.verifyResetToken=asyncHandler(async (req, res, next) => { 

    const hashedtoken = crypto.createHash("sha256").update(req.body.resetToken).digest("hex");
    
    const user =await User.findOne({ passwordResetToken:hashedtoken, passwordResetExpired: { $gt: Date.now() } });
   
    if (!user) {
        return next(new ApiError("token is invalid or expired ", 400));

    }

    user.passwordResetTokenVerified = true;
    await user.save({ validateBeforeSave: false });
  res.status(200).json({ status: "success",message:"verified" });



});


exports.resetPassword = asyncHandler(async (req, res, next) => { 


    const user =await User.findOne({ email:req.body.email });
   
    if (!user) {
        return next(new ApiError("there is no user for this email ", 404));
    }

    if (!user.passwordResetTokenVerified) {
    return next(new ApiError("this email  is not verified ", 400));
}
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    user.passwordResetTokenVerified=undefined
    await user.save({ validateBeforeSave: false });


    const token = await createToken(user);
  res.status(200).json({ status: "success", data:user,token });

});



/////////////////////////////////////////////////////////

exports.logout =asyncHandler (async (req, res,next) => {
    req.user.tokens.splice(req.user.tokens.indexOf(req.token), 1);
    await req.user.save({ validateBeforeSave: false })
    res.status(200).json({ status: 'success' ,message:"logged out "});
});

exports.logoutAll =asyncHandler (async (req, res,next) => {
    req.user.tokens=[]
    await req.user.save({ validateBeforeSave: false })
   
    res.status(200).json({ status: 'success' ,message:"logged out All"});
});


exports.allowedTo = (...roles) => {
    return asyncHandler(async(req, res, next) => {
    
        if (!roles.includes(req.user.role)) {
            return next(new ApiError("you have not a permision to access ", 403))
        }
        next();
    })
}

///////////////////////////////////////////////

