var express = require('express');
var router = express.Router();
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

  // User.findById(userID,function(err,user){
  //     if(err){
  //       res.json({
  //         status: 'err',
  //         code: 500,
  //         message: err
  //       })
  //     }
  //     res.status(200).json({
  //       message: 'thanhcong',
  //       product: user.product,
  //       _id: user._id,
  //       email: user.email,
  //       name: user.userName
  //     })
  // });


});

module.exports = router;
