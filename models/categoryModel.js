const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');


const categorySchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nameType : String
})

module.exports = model('Category',categorySchema)
