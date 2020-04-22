const mongoose = require('mongoose');
const{ Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');
//const ObjectId = require('mongoose');
const userSchema = new mongoose.Schema({
    userID : String,
    userName : String,
    email: String,
    passWord: String,
    imageUser:String,
    phoneUser:String,
    product: [{type:mongoose.Schema.Types.ObjectId}] ,
    create_at: {
        type: Date,
        default: Date.now
    }
    
});

userSchema.methods.encryptPasword = async(passWord) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(passWord,salt);

};

userSchema.methods.validatePassword = function(passWord){
    return bcrypt.compare(passWord,this.passWord);
}

module.exports = model('User',userSchema)