const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const productSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nameProduct: String,
    priceProduct: Number,
    imageProduct: String,
    create_at: {
        type: Date,
        default: Date.now
    }
})


module.exports = model('Product',productSchema)

// module.exports.get = function(callback, limit){
//     Product.find(callback).limit(limit);
// }