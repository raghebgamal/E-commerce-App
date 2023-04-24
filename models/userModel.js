const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const slugify = require("slugify");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "user must have a name"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "user must have an email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "plz provide a valid email"]
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true,

    },
     tokens: [String],
    phone: String,
    image: String
        ,
    password: {
        type: String,
        required: [true, "please provide your password"],
        minlength: 8,
        select: true
    },
    
   
    role: {
        type: String,
        enum: ["user","manager", "admin"],
        default: "user"
        
    }
    ,
    passwordConfirm: {
        type: String,
        required: [true, "please confirm your password"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "passwords are not the same "
        }
    },
    
    passwordChangedAt: {
        type: Date
        
    },
    passwordResetToken: {
        type: String
        
    },
    passwordResetTokenVerified: {
        type: Boolean
        
    },
    passwordResetExpired: Date,
    active: {
        type: Boolean,
        default: true,
        select: true
    },
      wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const createImageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/users/${doc.image}`
        doc.image=imageUrl
    }
}

// userSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });
userSchema.post('init', function (doc) {
    createImageUrl(doc);
    
});

userSchema.post('save', function (doc) {
    createImageUrl(doc);
   
})
    

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")||this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.methods.correctPassword =  async function (candidatePassword,userPassword) {
  

    return await bcrypt.compare(candidatePassword, userPassword);
}
userSchema.methods.passwordChangedAfter = function (jwtTimestamb) {
    if (this.passwordChangedAt) {
        const changedtime=parseInt( this.passwordChangedAt.getTime()/1000,10)
        return jwtTimestamb < changedtime;
    }
    return false
}


userSchema.methods.correctPasswordReset = async function () {
    // const tokencrypto = crypto.randomBytes(32).toString("hex");
    const tokencrypto = Math.floor(100000 + Math.random() * 900000).toString();

    this.passwordResetToken = crypto.createHash("sha256").update(tokencrypto).digest("hex");
    this.passwordResetExpired = Date.now() + 10 * 60 * 1000;
    this.passwordResetTokenVerified = false
    
    return tokencrypto;
    
};

userSchema.methods.toJSON = function () {
    const userobj = this.toObject();
    delete userobj.password;
    delete userobj.tokens;
    delete userobj.active;

    return userobj;
}

userSchema.pre(/^find/, function (next) {
   
    this.find({ active: { $ne: false } })
 
    
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
