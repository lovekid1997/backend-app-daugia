const mongoose = require('mongoose');
const{ Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    userName : String,
    email: String,
    passWord: String,
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