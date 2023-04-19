"use strict";

var mongoose = require("mongoose");

var brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "brand name is required"],
    unique: [true, "brand must be unique"],
    minlength: [3, "too short brand name "],
    maxlength: [32, "too long brand name"]
  },
  slug: {
    type: String,
    lowercase: true
  },
  image: String
}, {
  timestamps: true
});

var createImageUrl = function createImageUrl(doc) {
  if (doc.image) {
    var imageUrl = "".concat(process.env.BASE_URL, "/brands/").concat(doc.image);
    doc.image = imageUrl;
  }
};

brandSchema.post('init', function (doc) {
  createImageUrl(doc);
});
brandSchema.post('save', function (doc) {
  createImageUrl(doc);
});
brandSchema.index({
  name: "text"
});
var Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;