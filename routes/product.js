
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const moment =require('moment');

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


//get all
router.get('/',(req,res,next)=>{
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

//new product
router.post('/new/:userID/:productTypeID',upload.array('imageProduct',5),(req,res,next)=>{
    const userID = req.params.userID;
    const productTypeID = req.params.productTypeID;
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        idUser: userID,
        idProductType: productTypeID,
        nameProduct: req.body.nameProduct,
        startPriceProduct: req.body.startPriceProduct,
        //imageProduct: path.basename(req.files.path),
        status: req.body.status,
        description: req.body.description,
        extraTime: req.body.extraTime
    }
    );
        var filesImage = req.files;
        filesImage.forEach(function(item, index, array) {
            product.imageProduct.unshift(item.filename);
            console.log(product.imageProduct[index]);
      });

    //product.imageProduct.concat(req.file.path);

    //console.log(req.files[0].path);

    product.save(function(err){
        if(err){
            res.json({
                status: 'err',
                code: 500,
                message: err
            })
        }else{
            res.json({
                status: 'success',
                code: 200,
                message: 'Register save',
                data: product,
                hour: product.registerDate.getHours()
            })
        }
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