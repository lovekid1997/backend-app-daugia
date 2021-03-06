
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');


const storage = multer.diskStorage({
destination: function(req,file,cb){
    cb(null,'./uploads/');
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

const Product = require('../models/productModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const admin = require('firebase-admin');
const service = require('../happjshop-firebase-adminsdk-d34k9-b19c4f8b14.json');

admin.initializeApp({
    credential: admin.credential.cert(service),
    databaseURL: 'https://happjshop.firebaseio.com/'
});

const db = admin.database();



//new product
// router.post('/new/:userID/:productTypeID',upload.array('imageProduct',5),(req,res,next)=>{
//     const userID = req.params.userID;
//     const productTypeID = req.params.productTypeID;
//     const product = new Product({
//         _id: new mongoose.Types.ObjectId(),
//         idUser: userID,
//         idProductType: productTypeID,
//         nameProduct: req.body.nameProduct,
//         startPriceProduct: req.body.startPriceProduct,
//         //imageProduct: path.basename(req.files.path),
//         status: req.body.status,
//         description: req.body.description,
//         extraTime: req.body.extraTime
//     }
//     );
//         var filesImage = req.files;
//         filesImage.forEach(function(item, index, array) {
//             product.imageProduct.unshift(item.filename);
//             console.log(product.imageProduct[index]);
//       });

//     //product.imageProduct.concat(req.file.path);

//     //console.log(req.files[0].path);

//     product.save(function(err){
//         if(err){
//             res.json({
//                 status: 'err',
//                 code: 500,
//                 message: err
//             })
//         }else{
//             res.json({
//                 status: 'success',
//                 code: 200,
//                 message: 'Register save',
//                 data: product,
//                 hour: product.registerDate.getHours()
//             })
//         }
//     })

// });


//new product
router.post('/new/:userID',upload.array('imageProduct',5),(req,res,next)=>{
    const userID = req.params.userID;
    //const productTypeID = req.params.productTypeID;
    try {
        var filesImage = req.files;
        var images = [];
        filesImage.forEach(function(item, index, array) {
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
        const product = {
        imageProduct: images,
        nameProduct: req.body.nameProduct,
        userId : userID,
        nameProductType: req.body.nameProductType,
        startPriceProduct: req.body.startPriceProduct,
        status: req.body.status,
        description: req.body.description,
        extraTime: req.body.extraTime,
        registerDate : registerDatee,   
        winner : winner,
        hide : false,
        currentPrice: req.body.startPriceProduct,
        played : played,
        inspector : false,
        uyTin: req.body.uyTin,
        fcmtoken: req.body.fcmtoken,
        fcms: fcms
        };

        db.ref('products/').push(product);

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Successful',
            data: product,
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message : e.message
        })
    }
})

router.get('/asd/:userid',(req,res,next)=>{
    const userid = req.params.userid;
    var rootRef = db.ref('products').orderByChild('userId')
    .equalTo(userid);
    // rootRef.orderByChild('userId').equalTo('userid123').once("value").then(function(snapshot) {
    //     res.status(200).send(snapshot);
    //   });
      
rootRef.once("value")
  .then(function(snapshot) {
    var key = snapshot.key; // null
    var childKey = snapshot.child("products").key; // "ada"
    console.log("asd");
    snapshot.forEach((index)=>{
        console.log(index.val()['extraTime']);
    });
    console.log(snapshot.val());
    res.status(200).json({data : snapshot,
    });
  });

});


//get all
router.get('/d',(req,res,next)=>{
    var rootRef = db.ref('products');
      
    rootRef.once("value")
    .then(function(snapshot) {
        res.status(200).json({
            data: snapshot.toJSON()
       })
    });
});
router.get('/c',(req,res,next)=>{
    Product.find()
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            data: docs,
        }
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error: err
        })
    });

});

//get all by iduser
router.get('/:userID',(req,res,next)=>{
    const userID = req.params.userID;

    // Product.find( userID , function(err,product){
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

//get details product
router.get('/details/:productID', (req,res)=>{
    const productID = req.params.productID;
    Product.findById(productID)
    .exec()
    .then(docs => {
         res.status(200).json(docs); 
        })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
});


//get one product by id
router.get('/:productID',(req,res,next)=>{
    const id = req.params.productID;
    Product.findById(id,function(err,product){
        if(err){
            res.json({
                status:'err',
                code: 500,
                message: err
            })
        }
        res.json({
            status: 'success',
            code: 200,
            message: 'Registros encontrado',
            data: product
        })
    })
});

router.patch('/:productID',(req,res,next)=>{
    Product.findById(req.params.productID, function(err,product){
        if(err){
            res.json({
                status: 'err',
                code: 500,
                message: err
            })
        }
        product.nameProduct = req.body.nameProduct
        product.priceProduct = req.body.priceProduct
        product.save(function(err){
            if(err){
                res.json({
                    status: 'err',
                    code: 500,
                    message: err
                })
            }
            res.json({
                status: 'success',
                code: 200,
                message: 'Thanh cong'
                , data: product
            })
        })
    })
});

//delete one product
router.delete("/:productID",(req,res,next)=>{
    const id = req.params.productID;
    Product.remove({_id: id })
    .exec()
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
    // Product.remove({
    //     _id: id
    // }),
    // function(err){
    //     if(err){
    //         res.json({
    //             status: 'err',
    //             code: 500,
    //             message: err
    //         })
    //     }
    //     res.json({
    //         status: 'success',
    //         code: 200,
    //         message: 'thanh cong'
    //     })
    // }
});

module.exports = router;