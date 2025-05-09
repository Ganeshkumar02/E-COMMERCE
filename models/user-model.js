const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/ecommerce")

const userSchema = mongoose.Schema({
    fullname: {
        type:String,
        minLength: 3,
        trim: true,
    },
    email: String,
    password: String,
    cart:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
],
    orders:{ 
        type: Array,
        default:[]
    },
    conatact : Number,
    picture : String,
});

module.exports = mongoose.model("user", userSchema);