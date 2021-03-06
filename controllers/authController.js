
const {Router } = require('express')
const router = Router();

const User = require('../models/userModel');
const verifyToken = require('../controllers/verifyToken');

const jwt = require('jsonwebtoken')
const config = require('../config')

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./imageUser/');
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


    router.post('/signup',async(req,res) => {
        try{
            const findUser = await User.findOne({ phoneUser: req.body.phoneUser});

            if(findUser){  return res.status(404).send("Số điện thoại đã được đăng ký"); }

            const {userName, phoneUser , passWord} = req.body;
            //const imageUser =path.basename(req.file.path);
            const user = new User({
                userName: req.body.userName,
                phoneUser: req.body.phoneUser,
                passWord: req.body.passWord,
                //imageUser : req.body.imageUser,
              //phoneUser: req.body.phoneUser,
                uytin: "10"
            });

                user.passWord = await user.encryptPasword(passWord);
                await user.save();
        
                const token = jwt.sign({ id: user.id },config.secret,{
                    expiresIn: '24h'
                });
        
                res.status(200).json({auth: true,token: token,
                    _id: user._id,
                    name: user.userName,
                    phoneUser: user.phoneUser,
                    address : user.addressUser,
                    uytin: user.uytin
                    });
        }
        catch (e)
        {   
            console.log(e)
            res.status(500).send('Phát sinh lỗi khi đăng ký');
        }
    });

// router.post('/signup',upload.single('imageUser'),async(req,res) => {
//     try{
//         const {userName, email , passWord} = req.body;
//         //const imageUser =path.basename(req.file.path);
//         const user = new User({
//             userName: req.body.userName,
//             email: req.body.email,
//             passWord: req.body.passWord,
//             imageUser : path.basename(req.file.path),
//             phoneUser: req.body.phoneUser
//         });

//         user.passWord = await user.encryptPasword(passWord);
//         await user.save();

//         const token = jwt.sign({ id: user.id },config.secret,{
//             expiresIn: '24h'
//         });

//         res.status(200).json({auth: true, token});

//     }
//     catch (e)
//     {   
//         console.log(e)
//         res.status(500).send('there was a problem signin');
//     }
// });



router.post('/signin',async(req,res)=>{
    try {
        const user = await User.findOne({ phoneUser: req.body.phoneUser, });
        //const user = await User.findOne({ phoneUser: req.body.phoneUser, });
        if(!user){
            return res.status(404).send("The phone doesn't exist");
        }

        const validPassword = await user.validatePassword(req.body.passWord, user.passWord);

        if(!validPassword){
            // return res.status(401).send({auth: false, token: null });
            return res.status(404).send("Sai mật khẩu");
        }

        const token = jwt.sign({ id:user._id}, config.secret,{
            expiresIn: '24h'
        });

        res.status(200).json({auth: true,
        token: token,
        _id: user._id,
        name: user.userName,
        phoneUser: user.phoneUser,
        address : user.addressUser,
        uytin: user.uytin});

    } catch (e) {
        console.log(e)
        res.status(500).send('there was a problem signin');
    }
});

router.get('/logout', function(req,res){
    res.status(200).send({auth : false, token: null});
});

module.exports = router;