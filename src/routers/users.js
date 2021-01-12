require('../db/mongoose.js');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = new express.Router();
const auth = require('../middleware/auth.js');
const { sendWelcomeEmail,sendCancelationEmail } = require('../emails/account.js');
const User = require('../models/user.js');


//const Task=require('../models/task.js');

//**CREATE(SIGN UP)**//

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });

    } catch (e) {
        res.status(400).send(e);
    }
})

//** LOG IN**/
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCrudentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({
            user,
            token
        });

    } catch (e) {
        res.status(400).send();

    }
})

//**READ PROFILE FOR ME AFTER LOG IN AND SIGN UP, AND AUTHENTICATE**//

router.get('/users/me', auth, async (req, res) => {

    res.send(req.user);

})

//**LOG OUT FROM ONE DEVICE**//
router.post('/users/logout', auth, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send();

    } catch (e) {
        res.status(500).send();
    }
})

//**LOG OUT FROM ALL DEVICE **//

router.post('/users/logoutAll', auth, async (req, res) => {
    try {

        req.user.tokens = [];
        await req.user.save();
        res.send();

    } catch (e) {
        res.status(500).send();
    }
})

//** UPDATE INDIVIDUAL**//

router.patch('/users/me', auth, async (req, res) => {

    //CHECK FOR INVALID UPDATES
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save();

        res.send(req.user);

    } catch (e) {
        res.status(400).send(e);
    }
})

//** DELETE**//

router.delete('/users/me', auth, async (req, res) => {
    try {

        await req.user.remove();
        sendCancelationEmail(req.user.email,req.user.name)
        //Tasks deleted when user delete profile
        // await Task.deleteMany({owner:req.user._id})
        res.send(req.user);

    } catch (e) {

        res.status(500).send(e);

    }
})

//PROFILE IMAGE UPLOAD  OR EDIT


const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // if(!file.originalname.match(/\.(pdf)$/)){
        //     return cb(new Error('Please upload PDF flle'))
        // }

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => { //same name in postman key('avatar')

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer
    await req.user.save();
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })

})

//PROFILE IMAGE DELETE


router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save();
    res.send()
})

//GET PROFILE IMAGE OF A USER

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.setHeader('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch (e) {
        res.status(400).send();

    }

})


module.exports = router;



//OLD CODES


//**READ MANY**//
// router.get('/users', async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)

//     } catch (e) {
//         res.status(500).send();
//     }
// })

//**READ INDIVIDUAL (PROFILE) NOT NEEDED**//

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     // let isValidId = mongoose.Types.ObjectId.isValid(_id);
//     try {
//         const user = await User.findById(_id)
//         if (user.length === 0) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {

//         res.status(500).send(e);
//     }

// })

//** UPDATE INDIVIDUAL**//

// router.patch('/users/:id', async (req, res) => {

//     //CHECK FOR INVALID UPDATES
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['name', 'email', 'age', 'password']
//     const isValidOperation = updates.every((update) => {
//         return allowedUpdates.includes(update)
//     })
//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }
//     try {
//         const user = await User.findById(req.params.id);
//         updates.forEach((update) => {
//             user[update] = req.body[update]
//         })
//         await user.save();

//         //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);

//     } catch (e) {
//         res.status(400).send(e);
//     }
// })

// //** DELETE**//

// router.delete('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);

//         //const count =await User.countDocuments({});
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//         //res.send(count)

//     } catch (e) {

//         res.status(500).send(e);

//     }
// })

// const bcrypt=require('bcryptjs');
// const myFunction=async()=>{
//     const password='jewel12345';
//     const hashedPassword=await bcrypt.hash(password,8);
//     console.log(password);
//     console.log(hashedPassword);

//     const isMatch=await bcrypt.compare('Jewel12345',hashedPassword);
//     console.log(isMatch);
// }
// myFunction();

