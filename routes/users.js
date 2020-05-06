var express = require('express');
var router = express.Router();

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

    if(req.file.filename){
      userInfo.imageUser = req.file.filename;
    }
    userInfo.userName = req.body.userName;
    userInfo.email = req.body.email;
    userInfo.note = req.body.note;
    userInfo.save().then(user => {
      res.status(200).json({
        message: "update successful"
      })
    }
    )
  }).catch(err => {
    console.log(err)
        res.status(500).json({
            error: err
        })
  })
});

module.exports = router;
