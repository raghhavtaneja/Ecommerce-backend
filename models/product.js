const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type : String,
        trim : true,
        required : true,
        maxlength : 32
    },
    description: {
        type : String,
        trim : true,
        required : true,
        maxlength : 2000
    },
    price: {
        type : Number,
        required : true,
        maxlength : 32,
        trim : true
    },
    category: {
        type : ObjectId,
        ref : "Category",
        required : true,
    },
    photo: {
        data : Buffer,
        contentType : String
    },
    quantity: {
        type : Number
    },
    sold: {
        type : Number,
        default : 0
    },
    size: {
        type : String
    }
},{timestamps:true});

module.exports = mongoose.model("Product",productSchema);