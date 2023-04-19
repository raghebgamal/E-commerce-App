const mongoose = require("mongoose");
const Category = require("./categoryModel");
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "subCategory must be unique"],
      required: [true, "subCategory name is required"],
      minlength: [2, "too short subCategory name"],
      maxlength: [32, "too long subCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must belong to parent category"],
    },
  },
  { timestamps: true }
);
subCategorySchema.index({ name: "text"});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategory;
