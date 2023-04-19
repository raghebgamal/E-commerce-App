const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "category name is required"],
        unique: [true, "category must be unique"],
        minlength: [3, "too short category name "],
        maxlength:[32,"too long category name"]
    },
    slug: {
        type: String,
        lowercase:true
    },
    image:String

}, {
    timestamps:true
});

const createImageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`
        doc.image=imageUrl
    }
}
categorySchema.post('init', function (doc) {
    createImageUrl(doc);
    
});

categorySchema.post('save', function (doc) {
    createImageUrl(doc);
   
})


categorySchema.index({ name: "text" });


const Category = mongoose.model("Category", categorySchema);
module.exports = Category;