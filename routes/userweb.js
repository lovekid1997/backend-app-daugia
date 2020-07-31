var express = require('express');
var router = express.Router();
var passport = require('passport');
const mongoose = require('mongoose');
var Firebase = require('firebase-admin');
const path = require('path');
var nodemailer = require('nodemailer');
//var csrf = require('csurf');
//var csrfProtection = csrf();

//router.use(csrfProtection);


const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  }
  else { cb(null, false); }

};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
const User = require('../models/userModel');
// coinst db = Firebase.database();
// var rootRef = db.ref('products');

router.post('/sendemail', isLoggedIn, function (req, res, next) {
  var emails = [];
  var a = req.body.message;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'infohappj@gmail.com',
      pass: 'wearegreate'
    }
  });

  var s = a.split(',');

  var list = [];
  for (var i = 0; i < s.length; i += 2) {
    list.push(s[i]);
  }

  var unique = Array.from(new Set(list));

  User.find({
    '_id': { $in: unique }
  }).then(docs => {
    docs.forEach(function (data) {
      emails.push({ id: data._id, mail: data.email });
    });
    for (var i = 0; i < s.length; i += 2) {
      for (var j = 0; j < emails.length; j++) {
        if (s[i] == emails[j]['id']) {
          var text = "Xin vui lòng vào xác nhận sản phẩm " + s[i + 1];
          var mailOption = {
            from: 'infohappj@gmail.com',
            to: emails[j]['mail'],
            subject: 'Kiểm duyệt sản phẩm',
            text: text
          };
          transporter.sendMail(mailOption, function (err, data) {
            if (err) {
              console.log('err');
              console.log(err);
            } else {
              console.log('Email sent!!!');
            }
          });
        }
      }
    }
  }).then(() => {
    res.render('product/sendmail', { data: emails });
  });
});

router.post('/order', function (req, res, next) {
  var time = req.body.ngay;
  res.redirect('/user/order/' + time);
});

router.get('/order/:ngay', function (req, res, next) {
  var message = "";

  var ngay = req.params.ngay;

  var myDate = ngay.split("-");
  var newDate = myDate[1] + "/" + myDate[2] + "/" + myDate[0];

  var dayy = new Date(newDate);
  if (ngay.toString().length == 1) {
    message = "Vui lòng submit ngày";
  } else {
    message = "Đang chọn " + newDate;
  }
  var today = Date.now();

  var db = Firebase.database();
  var rootRef = db.ref('products');
  rootRef.once("value").then(function (data) {
    var thatbai = [];
    var thanhcong = [];
    var all = [];
    var all2 = [];
    var listId = [];

    data.forEach(function (index) {
      if (parseInt(today) < parseInt(index.val()['extraTime'])) {
        console.log("chua het thoi gian dau gia");
      } else {
        var d = new Date(parseInt(index.val()['extraTime']));
        var dd = String(d.getDate()).padStart(2, '0');
        var mm = String(d.getMonth() + 1).padStart(2, '0');
        var yyyy = d.getFullYear();
        d = mm + '/' + dd + '/' + yyyy;
        var dateF = new Date(d);

        if (dayy.getTime() == dateF.getTime()) {
          var key = index.key;
          if (data.child(key + "/failure").exists()) {
            if (index.val()['failure']) {
              thatbai.push({
                imageProduct: index.val()['imageProduct'],
                nameProduct: index.val()['nameProduct'],
                userId: index.val()['userId'],
                nameProductType: index.val()['nameProductType'],
                startPriceProduct: index.val()['startPriceProduct'],
                status: index.val()['status'],
                description: index.val()['description'],
                extraTime: index.val()['extraTime'],
                registerDate: index.val()['registerDate'],
                winner: index.val()['winner'],
                hide: index.val()['hide'],
                currentPrice: index.val()['currentPrice'],
                played: index.val()['played'],
                failure: index.val()['failure'],
                id: key
              });
            } else {
              thanhcong.push({
                imageProduct: index.val()['imageProduct'],
                nameProduct: index.val()['nameProduct'],
                userId: index.val()['userId'],
                nameProductType: index.val()['nameProductType'],
                startPriceProduct: index.val()['startPriceProduct'],
                status: index.val()['status'],
                description: index.val()['description'],
                extraTime: index.val()['extraTime'],
                registerDate: index.val()['registerDate'],
                winner: index.val()['winner'],
                hide: index.val()['hide'],
                currentPrice: index.val()['currentPrice'],
                failure: index.val()['failure'],
                played: index.val()['played'],
                id: key
              });
            }
            all.push({
              imageProduct: index.val()['imageProduct'],
              nameProduct: index.val()['nameProduct'],
              userId: index.val()['userId'],
              nameProductType: index.val()['nameProductType'],
              startPriceProduct: index.val()['startPriceProduct'],
              status: index.val()['status'],
              description: index.val()['description'],
              extraTime: index.val()['extraTime'],
              registerDate: index.val()['registerDate'],
              winner: index.val()['winner'],
              hide: index.val()['hide'],
              currentPrice: index.val()['currentPrice'],
              failure: index.val()['failure'],
              played: index.val()['played'],
              id: key
            });
          } else {
            all2.push({
              imageProduct: index.val()['imageProduct'],
              nameProduct: index.val()['nameProduct'],
              userId: index.val()['userId'],
              nameProductType: index.val()['nameProductType'],
              startPriceProduct: index.val()['startPriceProduct'],
              status: index.val()['status'],
              description: index.val()['description'],
              extraTime: index.val()['extraTime'],
              registerDate: index.val()['registerDate'],
              winner: index.val()['winner'],
              hide: index.val()['hide'],
              currentPrice: index.val()['currentPrice'],
              played: index.val()['played'],
              id: key
            });
            listId.push(
              index.val()['userId']);
            listId.push(index.val()['nameProduct']);
          }
        }
      }
    });


    res.render('product/order',
      {
        thanhcong: thanhcong,
        thatbai: thatbai,
        message: message,
        all: all,
        allChuaXacNhan: all2,
        lis: listId,
        day: newDate
      });
  })

});


router.get('/manager/details/:_id', isLoggedIn, function (req, res, next) {
  var idProduct = req.params._id;
  var listUser = [];
  User.findById(idProduct)
    .lean()
    .then(docs => {
      var date = new Date(docs.create_at);
      var d = new Date(date.getTime()).toLocaleString();
      res.render('product/usermanagerDetails', {
        data: docs, date: d
      });

    });

});


router.get('/manager', isLoggedIn, function (req, res, next) {

  var listUser = [];
  User.find()
    .lean()
    .then(docs => {
      docs.forEach(function (index) {
        listUser.push(index);
      });

      res.render('product/usermanager', {
        data: listUser,
        message: "message"
      });

    });



});

router.post('/product/inspector/view/edit/:_id', upload.array('imageProduct', 5), isLoggedIn, function (req, res, next) {
  const idProduct = req.params._id;
  const name = req.body.nameProduct;
  const type = req.body.cars;
  const status = req.body.status;
  const description = req.body.description;
  const currentPrice = req.body.currentPrice;
  console.log('zxczxczxczc');
  var filesImage = req.files;
  var images = [];
  filesImage.forEach(function (item, index, array) {
    images.unshift(item.filename);
  });
  var db = Firebase.database();
  var rootRef = db.ref('products');
  if (images[0] != null) {
    rootRef.child("/" + idProduct).update(
      {
        nameProduct: name,
        nameProductType: type,
        status: status,
        description: description,
        currentPrice: currentPrice,
        imageProduct: images
      }
    );
  } else {
    rootRef.child("/" + idProduct).update(
      {
        nameProduct: name,
        nameProductType: type,
        status: status,
        description: description,
        currentPrice: currentPrice
      }
    );
  }

  res.redirect('/user/product/inspector/view/' + idProduct);
});

router.post('/product/inspector/success/:_id', isLoggedIn, function (req, res, next) {
  var idProduct = req.params._id;

  var db = Firebase.database();
  var rootRef = db.ref('products');

  rootRef.child("/" + idProduct).update(
    {
      inspector: true
    }
  );
  console.log('asd');
  res.redirect('/user/product/inspector');
});


router.get('/product/inspector/view/edit/:_id', isLoggedIn, function (req, res, next) {
  var idProduct = req.params._id;

  var db = Firebase.database();
  var rootRef = db.ref('products');
  rootRef.orderByKey().equalTo(idProduct).once("value").then(function (dataSnapshot) {
    var item;
    var key
    dataSnapshot.forEach((itemm) => {
      item = itemm.val();
      key = itemm.key;
    });
    res.render('product/inspectorViewEdit', {
      //csrfToken: req.csrfToken(),
      data: item,
      id: key
    });
  });

});

router.get('/product/inspector/view/:id', isLoggedIn, function (req, res, next) {
  var idProduct = req.params.id;
  var db = Firebase.database();
  var rootRef = db.ref('products');
  rootRef.orderByKey().equalTo(idProduct).once("value").then(function (dataSnapshot) {
    var item;
    var key
    dataSnapshot.forEach((itemm) => {
      item = itemm.val();
      key = itemm.key;
    });
    res.render('product/inspectorView', {
      data: item,
      id: key
    });
  });

});


router.get('/product/inspector', isLoggedIn, function (req, res, next) {
  var db = Firebase.database();
  var rootRef = db.ref('products');
  rootRef.orderByChild('inspector').equalTo(false).once("value").then(function (dataSnapshot) {
    var item;
    var key
    var a = [];
    dataSnapshot.forEach((index) => {
      key = index.key;
      a.push({
        imageProduct: index.val()['imageProduct'],
        nameProduct: index.val()['nameProduct'],
        userId: index.val()['userId'],
        nameProductType: index.val()['nameProductType'],
        startPriceProduct: index.val()['startPriceProduct'],
        status: index.val()['status'],
        description: index.val()['description'],
        extraTime: index.val()['extraTime'],
        registerDate: index.val()['registerDate'],
        winner: index.val()['winner'],
        hide: index.val()['hide'],
        currentPrice: index.val()['currentPrice'],
        played: index.val()['played'],
        id: key
      });
    });
    res.render('product/inspector', {
      //csrfToken: req.csrfToken(),
      data: a
    });
  });

});

router.get('/product/detail/user/:id', isLoggedIn, function (req, res, next) {
  const idProduct = req.params.id;
  User.findById(idProduct)
    .lean()
    .then(docs => {
      console.log('start');
      console.log(docs.create_at);
      var date = new Date(docs.create_at);

      var a = date.getUTCDate() + "/" + date.getUTCMonth() + "/" + date.getUTCFullYear() + "  " + date.getUTCHours()
        + ":" + date.getUTCMinutes() + ":" + date.getUTCMilliseconds();
      var d = new Date(date.getTime()).toLocaleString();
      console.log("hoang minh giam");
      console.log(date.toLocaleString());
      res.render('product/detailUser', {
        data: docs, date: d
      });

    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    });


});

router.post('/product/remove/:id', isLoggedIn, function (req, res, next) {

  const idProduct = req.params.id;
  var db = Firebase.database();
  var rootRef = db.ref('products/' + idProduct);
  rootRef.remove();
  res.redirect('/user/product');
});

router.post('/product/addd', upload.array('imageProduct', 5), isLoggedIn, function (req, res, next) {

  var idd = "5ea4528ccaf1ab0017e0fe22";

  var filesImage = req.files;
  var images = [];
  filesImage.forEach(function (item, index, array) {
    images.unshift(item.filename);
  });
  var winner = [];
  winner.unshift("1");
  winner.unshift("Chưa có");
  //  var messages = [];
  // messages.unshift({
  //     a : "qwe",
  //     b : "asdq"
  // });
  var fcms = [];
  fcms.unshift("0");



  var played = [];
  played.unshift("null");
  var registerDatee = Date.now();

  // const product = {
  //   imageProduct: images,
  //   nameProduct: req.body.nameProduct,
  //   userId : userID,
  //   nameProductType: req.body.nameProductType,
  //   startPriceProduct: req.body.startPriceProduct,
  //   status: req.body.status,
  //   description: req.body.description,
  //   extraTime: req.body.extraTime,
  //   registerDate : registerDatee,   
  //   winner : winner,
  //   hide : false,
  //   currentPrice: req.body.startPriceProduct,
  //   played : played
  //   };
  var time = req.body.time;
  if (req.body.time == 2) {
    time = (parseInt(Date.now()) + 7200000).toString();
  }else if(req.body.time == 4){
    time = (parseInt(Date.now()) + 14400000).toString();
  }else if(req.body.time == 6){
    time = (parseInt(Date.now()) + 21600000).toString();
  }else if(req.body.time == 8){
    time = (parseInt(Date.now()) + 28800000).toString();
  }else if(req.body.time == 10){
    time = (parseInt(Date.now()) + 36000000).toString();
  }
  const product = {
    imageProduct: images,
    nameProduct: req.body.nameProduct,
    userId: idd,
    nameProductType: req.body.cars,
    startPriceProduct: req.body.currentPrice,
    status: req.body.status,
    description: req.body.description,
    extraTime: time,
    registerDate: registerDatee,
    winner: winner,
    hide: false,
    currentPrice: req.body.currentPrice,
    played: played,
    inspector: false,
    uyTin: req.body.uytin,
    fcms: fcms,
    fcmtoken: "cfNA8tQT-7A:APA91bFdIhmLRtQ09peSpwbQumhuS_Y9RdVTuWMtDBB5VsjkroB220fPwvakRBrF6dnBPh28YD3wpm_W3e9uSo0hYaLETSFaOMe6WrfbGCyWUvzXRO2K8HOybloGPZVOWim6Q_XjvLTP"
  };
  var db = Firebase.database();
  var rootRef = db.ref('products');
  rootRef.push(product);
  res.redirect('/user/product');

});


router.get('/product/add', isLoggedIn, function (req, res, next) {
  res.render('product/add');
});

router.post('/product/edit/:_id', upload.array('imageProduct', 5), isLoggedIn, function (req, res, next) {
  const idProduct = req.params._id;
  const name = req.body.nameProduct;
  const type = req.body.cars;
  const status = req.body.status;
  const description = req.body.description;
  const currentPrice = req.body.currentPrice;
  console.log('zxczxczxczc');
  var filesImage = req.files;
  var images = [];
  filesImage.forEach(function (item, index, array) {
    images.unshift(item.filename);
  });
  var db = Firebase.database();
  var rootRef = db.ref('products');
  if (images[0] != null) {
    rootRef.child("/" + idProduct).update(
      {
        nameProduct: name,
        nameProductType: type,
        status: status,
        description: description,
        currentPrice: currentPrice,
        imageProduct: images
      }
    );
  } else {
    rootRef.child("/" + idProduct).update(
      {
        nameProduct: name,
        nameProductType: type,
        status: status,
        description: description,
        currentPrice: currentPrice
      }
    );
  }

  res.redirect('/user/product/detail/' + idProduct);
});

router.get('/product/edit/:_id', isLoggedIn, function (req, res, next) {
  const idProduct = req.params._id;

  var db = Firebase.database();
  var rootRef = db.ref('products');
  rootRef.orderByKey().equalTo(idProduct).once("value").then(function (dataSnapshot) {
    var item;
    var key
    dataSnapshot.forEach((itemm) => {
      item = itemm.val();
      key = itemm.key;
    });
    res.render('product/edit', {
      //csrfToken: req.csrfToken(),
      data: item,
      id: key
    });
  });

});

router.get('/product/detail/:_id', isLoggedIn, function (req, res, next) {
  const idProduct = req.params._id;

  var db = Firebase.database();
  var rootRef = db.ref('products');
  rootRef.orderByKey().equalTo(idProduct).once("value").then(function (dataSnapshot) {
    var item;
    var key
    dataSnapshot.forEach((itemm) => {
      item = itemm.val();
      key = itemm.key;
    });
    res.render('product/detail', {
      data: item,
      id: key
    });
  });

});

router.get('/product', isLoggedIn, function (req, res, next) {
  var db = Firebase.database();
  var rootRef = db.ref('products');
  var a = [];
  rootRef.orderByChild('inspector').equalTo(true).once('value', function (dataSnapshot) {

    dataSnapshot.forEach(function (index) {
      var key = index.key;
      a.push({
        imageProduct: index.val()['imageProduct'],
        nameProduct: index.val()['nameProduct'],
        userId: index.val()['userId'],
        nameProductType: index.val()['nameProductType'],
        startPriceProduct: index.val()['startPriceProduct'],
        status: index.val()['status'],
        description: index.val()['description'],
        extraTime: index.val()['extraTime'],
        registerDate: index.val()['registerDate'],
        winner: index.val()['winner'],
        hide: index.val()['hide'],
        currentPrice: index.val()['currentPrice'],
        played: index.val()['played'],
        id: key
      });
      // console.log(key);
    });


    res.render('product/product',
      {
        data: a
      });
  });
});

router.get('/admin', isLoggedIn, function (req, res, next) {
  var idd = "5ea4528ccaf1ab0017e0fe22";
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
  var a = [];
  rootRef.orderByChild('inspector').equalTo(true).once("value").then(function (snapshot) {
    snapshot.forEach((index) => {
      var key = index.key;
      a.push({
        imageProduct: index.val()['imageProduct'],
        nameProduct: index.val()['nameProduct'],
        userId: index.val()['userId'],
        nameProductType: index.val()['nameProductType'],
        startPriceProduct: index.val()['startPriceProduct'],
        status: index.val()['status'],
        description: index.val()['description'],
        extraTime: index.val()['extraTime'],
        registerDate: index.val()['registerDate'],
        winner: index.val()['winner'],
        hide: index.val()['hide'],
        currentPrice: index.val()['currentPrice'],
        played: index.val()['played'],
        id: key
      });

      var dem = [];

      dem = index.val()['played'];
      dem.shift();
      if (index.val()['nameProductType'] == "Thực phẩm sạch") {
        console.log('start');
        dem.forEach(function (item, index) {
          chart1.push(item);
        });
      } else if (index.val()['nameProductType'] == "Hàng nhập khẩu") {
        dem.forEach(function (item, index) {

          chart2.push(item);
        });
      } else if (index.val()['nameProductType'] == "Thời trang") {
        dem.forEach(function (item, index) {

          chart3.push(item);
        });
      } else if (index.val()['nameProductType'] == "Điện máy") {
        dem.forEach(function (item, index) {

          chart4.push(item);
        });
      } else if (index.val()['nameProductType'] == "Bất động sản") {
        dem.forEach(function (item, index) {

          chart5.push(item);
        });
      } else if (index.val()['nameProductType'] == "Xe cộ") {
        dem.forEach(function (item, index) {

          chart6.push(item);
        });
      } else if (index.val()['nameProductType'] == "Khác") {
        dem.forEach(function (item, index) {

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
      chart7: chart7.length,
      data: a,
      admin: "5ea4528ccaf1ab0017e0fe22"
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


router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {
    //csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});


router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/admin',
  failureRedirect: '/user/signin',
  failureFlash: true
}));


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

// router.get('/asd/:userid', (req, res, next) => {
//   const userid = req.params.userid;
//   var rootRef = db.ref('products').orderByChild('userId')
//     .equalTo(userid);
//   // rootRef.orderByChild('userId').equalTo('userid123').once("value").then(function(snapshot) {
//   //     res.status(200).send(snapshot);
//   //   });

//   rootRef.once("value")
//     .then(function (snapshot) {
//       var key = snapshot.key; // null
//       var childKey = snapshot.child("products").key; // "ada"
//       console.log("asd");
//       snapshot.forEach((index) => {
//         console.log(index.val()['extraTime']);
//       });
//       console.log(snapshot.val());
//       res.status(200).json({
//         data: snapshot,
//       });
//     });
//   res.redirect('/user/product/add');
// });