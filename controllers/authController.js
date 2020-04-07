
const {Router } = require('express')
const router = Router();

const User = require('../models/userModel');
const verifyToken = require('../controllers/verifyToken');

const jwt = require('jsonwebtoken')
const config = require('../config')


//const productController = require('../controllers/productController');

router.post('/signup',async(req,res) => {
    try{
        const {userName, email , passWord} = req.body;

        const user = new User({
            userName,
            email,
            passWord
        });

        user.passWord = await user.encryptPasword(passWord);
        await user.save();

        const token = jwt.sign({ id: user.id },config.secret,{
            expiresIn: '24h'
        });

        res.status(200).json({auth: true, token});

    }
    catch (e)
    {   
        console.log(e)
        res.status(500).send('there was a problem signin');
    }
});


// router.route('/products/:id',)
//         .get(productController.index)
//         .post(productController.new)


// router.route('/product/:id')
//         .get(productController.view)
//         .post(productController.update)
//         .delete(productController.delete)

router.post('/signin',async(req,res)=>{
    try {
        const user = await User.findOne({ email: req.body.email, });
        if(!user){
            return res.status(404).send("The email doesn't exist");
        }

        const validPassword = await user.validatePassword(req.body.passWord, user.passWord);

        if(!validPassword){
            return res.status(401).send({auth: false, token: null });
        }

        const token = jwt.sign({ id:user._id    }, config.secret,{
            expiresIn: '24h'
        });

        res.status(200).json({auth: true, token,
        id: user._id,
        name: user.userName,
        email: user.email});

    } catch (e) {
        console.log(e)
        res.status(500).send('there was a problem signin');
    }
});

router.get('/logout', function(req,res){
    res.status(200).send({auth : false, token: null});
});

module.exports = router;