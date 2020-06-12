var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Firebase = require('firebase-admin');
var csrfProtection = csrf();

router.use(csrfProtection);

router.get('/product',isLoggedIn,function(req,res,next){
  res.render('product/product');
});

router.get('/admin', isLoggedIn, function (req, res, next) {

  var productId = req.params.datepick;

  
  var db = Firebase.database();
  var rootRef = db.ref('products');
  var chart1 = [];
  var chart2 = [];
  var chart3 = [];
  var chart4 = [];
  var chart5 = [];
  var chart6 = [];
  var chart7 = [];

  rootRef.once("value").then(function (snapshot) {
    snapshot.forEach((index) => {
      var dem = [];

      dem = index.val()['played'];
      dem.shift();
      if (index.val()['nameProductType'] == "Thực phẩm sạch") {
        console.log('start');
        dem.forEach(function (item, index) {
          console.log(item);
          chart1.push(item);
        });
      } else if (index.val()['nameProductType'] == "Hàng nhập khẩu") {
        dem.forEach(function (item, index) {
          console.log(item);
          chart2.push(item);
        });
      } else if (index.val()['nameProductType'] == "Thời trang") {
        dem.forEach(function (item, index) {
          console.log(item);
          chart3.push(item);
        });
      } else if (index.val()['nameProductType'] == "Điện máy") {
        dem.forEach(function (item, index) {
          console.log(item);
          chart4.push(item);
        });
      } else if (index.val()['nameProductType'] == "Bất động sản") {
        dem.forEach(function (item, index) {
          console.log(item);
          chart5.push(item);
        });
      } else if (index.val()['nameProductType'] == "Xe cộ") {
        dem.forEach(function (item, index) {
          console.log(item);
          chart6.push(item);
        });
      } else if (index.val()['nameProductType'] == "Khác") {
        dem.forEach(function (item, index) {
          console.log(item);
          chart7.push(item);
        });
      }
    });

    res.render('user/admin', {
      chart1: chart1.length,
      chart2: chart2.length,
      chart3: chart3.length,
      chart4: chart4.length,
      chart5: chart5.length,
      chart6: chart6.length,
      chart7: chart7.length
    });
  });


});


router.get('/logout', function (req, res, next) {
  req.logOut();
  res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
  next();
});

// router.get('/signup', function (req, res, next) {
//   var messages = req.flash('error');
//   res.render('user/signup', {
//     csrfToken: req.csrfToken(),
//     messages: messages,
//     hasErrors: messages.length > 0
//   });
// });

// router.post('/signup', passport.authenticate('local.signup', {
//   successRedirect: '/user/profile',
//   failureRedirect: '/user/signup',
//   failureFlash: true
// }));


router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});


router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/admin',
  failureRedirect: '/user/signin',
  failureFlash: true
}));






module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}