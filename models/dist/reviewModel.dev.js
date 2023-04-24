"use strict";

var mongoose = require("mongoose");

var Product = require("./productModel");

var reviewSchema = new mongoose.Schema({
  title: {
    type: String
  },
  ratings: {
    type: Number,
    min: [1, "Min ratings value is 1.0"],
    max: [5, "Max ratings value is 5.0"],
    required: [true, "review ratings required"]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must belong to user"]
  },
  // parent reference (one to many)
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "Review must belong to product"]
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email"
  });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = function _callee(productId) {
  var result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(this.aggregate([// Stage 1 : get all reviews in specific product
          {
            $match: {
              product: productId
            }
          }, // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
          {
            $group: {
              _id: "product",
              avgRatings: {
                $avg: "$ratings"
              },
              ratingsQuantity: {
                $sum: 1
              }
            }
          }]));

        case 2:
          result = _context.sent;

          if (!(result.length > 0)) {
            _context.next = 8;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(Product.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].avgRatings,
            ratingsQuantity: result[0].ratingsQuantity
          }));

        case 6:
          _context.next = 10;
          break;

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0
          }));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
};

reviewSchema.post("save", function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(this.constructor.calcAverageRatingsAndQuantity(this.product));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
});
reviewSchema.post("findOneAndUpdate", function _callee3(doc) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(doc.constructor.calcAverageRatingsAndQuantity(doc.product));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
});
reviewSchema.post("findOneAndDelete", function _callee4(doc) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(doc.constructor.calcAverageRatingsAndQuantity(doc.product));

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
});
module.exports = mongoose.model("Review", reviewSchema);