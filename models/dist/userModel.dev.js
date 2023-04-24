"use strict";

var mongoose = require("mongoose");

var validator = require("validator");

var crypto = require("crypto");

var slugify = require("slugify");

var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
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
    lowercase: true
  },
  tokens: [String],
  phone: String,
  image: String,
  password: {
    type: String,
    required: [true, "please provide your password"],
    minlength: 8,
    select: true
  },
  role: {
    type: String,
    "enum": ["user", "manager", "admin"],
    "default": "user"
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function validator(el) {
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
    "default": true,
    select: true
  },
  wishlist: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  addresses: [{
    id: {
      type: mongoose.Schema.Types.ObjectId
    },
    alias: String,
    details: String,
    phone: String,
    city: String,
    postalCode: String
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

var createImageUrl = function createImageUrl(doc) {
  if (doc.image) {
    var imageUrl = "".concat(process.env.BASE_URL, "/users/").concat(doc.image);
    doc.image = imageUrl;
  }
}; // userSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });


userSchema.post('init', function (doc) {
  createImageUrl(doc);
});
userSchema.post('save', function (doc) {
  createImageUrl(doc);
});
userSchema.pre("save", function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (this.isModified("password")) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, 12));

        case 4:
          this.password = _context.sent;
          this.passwordConfirm = undefined;
          next();

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});
userSchema.pre("save", function _callee2(next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(!this.isModified("password") || this.isNew)) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", next());

        case 2:
          this.passwordChangedAt = Date.now() - 1000;
          next();

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
});

userSchema.methods.correctPassword = function _callee3(candidatePassword, userPassword) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(bcrypt.compare(candidatePassword, userPassword));

        case 2:
          return _context3.abrupt("return", _context3.sent);

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
};

userSchema.methods.passwordChangedAfter = function (jwtTimestamb) {
  if (this.passwordChangedAt) {
    var changedtime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtTimestamb < changedtime;
  }

  return false;
};

userSchema.methods.correctPasswordReset = function _callee4() {
  var tokencrypto;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // const tokencrypto = crypto.randomBytes(32).toString("hex");
          tokencrypto = Math.floor(100000 + Math.random() * 900000).toString();
          this.passwordResetToken = crypto.createHash("sha256").update(tokencrypto).digest("hex");
          this.passwordResetExpired = Date.now() + 10 * 60 * 1000;
          this.passwordResetTokenVerified = false;
          return _context4.abrupt("return", tokencrypto);

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  }, null, this);
};

userSchema.methods.toJSON = function () {
  var userobj = this.toObject();
  delete userobj.password;
  delete userobj.tokens;
  delete userobj.active;
  return userobj;
};

userSchema.pre(/^find/, function (next) {
  this.find({
    active: {
      $ne: false
    }
  });
  next();
});
var User = mongoose.model("User", userSchema);
module.exports = User;