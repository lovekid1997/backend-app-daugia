var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
/* GET users listing. */
router.get('/:userID', function(req, res, next) {
  const userID = req.params.userID;
//  try{
//   User.findOne({userID: userID},function(err,user){
//     if(err){
//       res.json({
//         status: 'err',
//         code: 500,
//         message: err
//       })
//     }
//     res.status(200).json({
//       data: user,
//       _id : user.userID,
//       name: user.userName,
//       email: user.email
//     })
//   });   
//  }catch(e){
//   console.log(e)
//   res.status(500).send('there was a problem signin');
//  }
 User.findOne({userID: userID})
    .exec()
    .then(docs => {
        const response = {
            // count: docs.length,
            product: docs
        }
            res.status(200).json({data:docs,
              _id : docs.userID,
              name: docs.userName,
              email: docs.email
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
