var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
/* GET users listing. */
router.get('/:userID', function(req, res, next) {
  const userID = req.params.userID;
  User.findById(userID,function(err,user){
      if(err){
        res.json({
          status: 'err',
          code: 500,
          message: err
        })
      }
      res.status(200).json({
        message: 'thanhcong',
        data: user
      })
  });

//   User.findById( userID , function(err,user){
//     if(err){
//         res.json({
//             status:'err',
//             code: 500,
//             message: err
//         })
//     }
//     res.json({
//         status: 'success',
//         code: 200,
//         message: 'Registros encontrado',
//         data: user.product
//     })
// })
});

module.exports = router;
