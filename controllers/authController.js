
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
            //const {id, userName, email , imageUser,phoneUser} = req.body;
            //const imageUser =path.basename(req.file.path);
            const user = new User({
                userID : req.body.id ,
                userName: req.body.userName,
                email: req.body.email,
                //passWord: req.body.passWord,
                imageUser : req.body.imageUser,
                phoneUser: req.body.phoneUser
            });

            
            // if(user.passWord != null){
            //     user.passWord = await user.encryptPasword(passWord);
            //     await user.save();
        
            //     const token = jwt.sign({ id: user.id },config.secret,{
            //         expiresIn: '24h'
            //     });
        
            //     res.status(200).json({auth: true, token,
            //         id: user._id,
            //         name: user.userName,
            //         email: user.email,
            //         phoneUser: user.phoneUser});
            // }else
                await user.save();
                res.status(200).json({
                    data: user,
                    message: "thanh cong",
                    _id: user._id,
                    id: user.userID,
                    name: user.userName,
                    email: user.email,
                    phoneUser: user.phoneUser});
            
        }
        catch (e)
        {   
            console.log(e)
            res.status(500).send('there was a problem signin');
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
      //  const user = await User.findOne({ email: req.body.email, });
        const user = await User.findOne({ phoneUser: req.body.phoneUser, });
        if(!user){
            return res.status(404).send("The phone doesn't exist");
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
        email: user.email,
        phoneUser: user.phoneUser});

    } catch (e) {
        console.log(e)
        res.status(500).send('there was a problem signin');
    }
});

router.get('/logout', function(req,res){
    res.status(200).send({auth : false, token: null});
});

module.exports = router;