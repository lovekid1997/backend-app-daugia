var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken')
const config = require('../config')

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./imageUser/');
    },
    filename: function(req,file,cb){
        cb(null,  Date.now() +  file.originalname);
    }
    });
    const fileFilter = (req,file, cb) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ||file.mimetype === 'image/jpg'){
            cb(null, true);
        }
        else
         {cb(null, false);}
        
    };
    
    const upload = multer({storage: storage,
        limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter});



var User = require('../models/userModel');


/* GET users listing. */
router.get('/:userID', function(req, res, next) {
  const userID = req.params.userID;
 User.findById(userID)
    .exec()
    .then(docs => {
            res.status(200).json({
              data:docs,
              _id : docs._id,
              name: docs.userName,
              phone: docs.phoneUser,
              test: "asd"
            });

    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error: err
        })
   });
});

router.put('/update/:userID',upload.single('imageUser'),async(req,res) =>{
  const userID = req.params.userID;
  User.findById(userID).exec()
  .then(userInfo =>{
    var file = req.file;

      userInfo.imageUser = req.file.filename;
      userInfo.userName = req.body.userName;
      userInfo.email = req.body.email;
      userInfo.note = req.body.note;
    
    userInfo.save().then(user => {
      res.status(200).json({
        message: "update successful",
        data: user
      })
    }
    ).catch(err => {
      res.status(500).json({error: err});
    })
  }).catch(err => {
    console.log(err)
        res.status(500).json({
            error: err
        })
  })
});

router.put('/updatee/:userID',upload.single('imageUser'),async(req,res) =>{
  const userID = req.params.userID;
  User.findById(userID).exec()
  .then(userInfo =>{

      userInfo.userName = req.body.userName;
      userInfo.email = req.body.email;
      userInfo.note = req.body.note;

    userInfo.save().then(user => {
      res.status(200).json({
        message: "update successful",
        data: user
      })
    }
    ).catch(err => {
      res.status(500).json({error: err});
    })
  }).catch(err => {
    console.log(err)
        res.status(500).json({
            error: err
        })
  })
});


//reset password
router.put('/update/myaccount/:phoneUser',async(req,res) =>{
  try{

    const phoneUser = req.params.phoneUser;

    const user = await User.findOne({ phoneUser: phoneUser });
    //const user = await User.findOne({ phoneUser: req.body.phoneUser, });
    if(!user){
        return res.status(404).send("The phone doesn't exist");
    }

    user.passWord = await user.encryptPasword(req.body.passWord);
    await user.save();
  
    res.status(200).json({
      message: "Success! Your Password has been changed! please login again"
    });
    
  }catch(e){
    console.log(e)
    res.status(500).send('Phát sinh lỗi khi reset password');
  }
});

router.post('/checkPassword/:userID',async(req,res)=>{
  try {
      const userID = req.params.userID;
      const user = await User.findById(userID);

      const validPassword = await user.validatePassword(req.body.passWord, user.passWord);

      if(!validPassword){
          // return res.status(401).send({auth: false, token: null });
          return res.status(200).send( false);
      }else{
        return res.status(200).send( true);
      }

  } catch (e) {
      console.log(e)
      res.status(500).send('xay ra loi khi check password');
  }
});
module.exports = router;
