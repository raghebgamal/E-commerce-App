const mongoose = require("mongoose");


const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "brand name is required"],
        unique: [true, "brand must be unique"],
        minlength: [3, "too short brand name "],
        maxlength:[32,"too long brand name"]
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
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`
        doc.image=imageUrl
    }
}
brandSchema.post('init', function (doc) {
    createImageUrl(doc);
    
});

brandSchema.post('save', function (doc) {
    createImageUrl(doc);
   
})


brandSchema.index({ name: "text"});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;