
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

//get all
router.get('/',(req,res,next)=>{
    Product.find()
    .exec()
    .then(docs => {
        const response = {
            // count: docs.length,
            image: docs[0].imageProduct,
            product: docs
        }
   //    if(docs.length >= 0){
            res.status(200).json(docs);
    //    }
        // else{
        //     res.status(404).json({
        //         message: 'not entries found'
        //     })
        // }
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

//     Product.find()
//     .exec()
//     .then(docs => {
//         const response = {
//             count: docs.length,
//             product: docs
//         }
//    //    if(docs.length >= 0){
//             res.status(200).json(response);
//     //    }
//         // else{
//         //     res.status(404).json({
//         //         message: 'not entries found'
//         //     })
//         // }
//     })
//     .catch(err=>{
//         console.log(err)
//         res.status(500).json({
//             error: err
//         })
//     });
    User.findById( userID , function(err,user){
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
            data: user.product
        })
    })
});

//new product
router.post('/:userID',upload.single('imageProduct'),(req,res,next)=>{
    const userID = req.params.userID;
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        nameProduct: req.body.nameProduct,
        priceProduct: req.body.priceProduct,
        imageProduct: path.basename(req.file.path)

    }
    );
    console.log(path.basename(product.imageProduct))
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
            message: 'Register save',
            data: product
        })
    })

    User.findById( userID , function(err,user){
        if(err){
            res.json({
                status: 'err',
                code: 500,
                message: err
            })
        }
        user.product.unshift(product._id)
        user.save()
    })
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