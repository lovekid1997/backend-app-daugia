const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const User = require('../models/userModel');
const Category = require('../models/categoryModel');

router.post('/new',(req,res,next)=>{

    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        nameType: req.body.nameType
    }
    );

    category.save(function(err){
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
            message: 'Thành công',
            data: category
        })
    })

});
module.exports = router;