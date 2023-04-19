"use strict";

var mongoose = require("mongoose");

var slugify = require("slugify");

var productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "too short product title "],
    maxlength: [100, "too long product title"]
  },
  slug: {
    type: String,
    required: false,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, "description is requierd"],
    minlength: [20, "too short description "]
  },
  quantity: {
    type: Number,
    required: [true, "product quantity is requierd"]
  },
  sold: {
    type: Number,
    "default": 0
  },
  price: {
    type: Number,
    required: [true, "product price is requierd"],
    trim: true,
    max: [200000, "very high price"]
  },
  priceAfterDiscount: {
    type: Number,
    trim: true
  },
  colors: [String],
  imageCover: {
    type: String,
    required: [true, "product imageCover is requierd"]
  },
  images: [{
    type: String,
    required: [true, "product images is requierd"]
  }],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "product must be belong to category"]
  },
  subCategories: [{
    type: mongoose.Schema.ObjectId,
    ref: "SubCategory"
  }],
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: "Brand"
  },
  ratingsAverage: {
    type: Number,
    min: [1, "rating must be above or equal 1"],
    max: [5, "rating must be  below or equal 5"]
  },
  ratingsQuantity: {
    type: Number,
    "default": 0
  }
}, {
  timestamps: true
});

var createImageUrl = function createImageUrl(doc) {
  if (doc.imageCover) {
    var imageUrl = "".concat(process.env.BASE_URL, "/products/").concat(doc.imageCover);
    doc.imageCover = imageUrl;
  }

  if (doc.images) {
    var images = [];
    doc.images.forEach(function (element) {
      var imageUrl = "".concat(process.env.BASE_URL, "/products/").concat(element);
      images.push(imageUrl);
    });
    doc.images = images;
  }
};

productSchema.post('init', function (doc) {
  createImageUrl(doc);
});
productSchema.post('save', function (doc) {
  createImageUrl(doc);
});
productSchema.pre('save', function (next) {
  this.slug = slugify(this.title, {
    lower: true
  });
  next();
});
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: " name"
  });
  next();
});
productSchema.index({
  title: "text",
  description: "text"
});
var Product = mongoose.model("Product", productSchema);
module.exports = Product;