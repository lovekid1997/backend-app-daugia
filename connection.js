const mongoose = require('mongoose');

const URI = "mongodb+srv://abc:vinhbao@happjapp-njhuk.mongodb.net/test?retryWrites=true&w=majority"

const  connectDB = async () =>{
   await mongoose.connect(URI,{
       useUnifiedTopology: true,
       useNewUrlParser: true 
   });
   console.log(' db connected');
}

module.exports = connectDB;

// mongoose.connect('mongodb://localhost:27017/happjdb',{
//     useNewUrlPaerser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// }).then(db => console.log('connection successfully'));