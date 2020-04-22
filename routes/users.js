var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
/* GET users listing. */
router.get('/:userID', function(req, res, next) {
  const userID = req.params.userID;
 try{
  User.findOne({userID: userID},function(err,user){
    if(err){
      res.json({
        status: 'err',
        code: 500,
        message: err
      })
    }
    res.status(200).json({
      data: user,
      _id : user.userID,
      name: user.userName,
      email: user.email
    })
  });   
 }catch(e){
  console.log(e)
  res.status(500).send('there was a problem signin');
 }


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
