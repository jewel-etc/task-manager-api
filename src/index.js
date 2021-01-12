
const express = require('express');
const userRouter = require('./routers/users.js');
const taskRouter = require('./routers/tasks.js');
const app = express();
const port = process.env.PORT;


//ADD MIDDLEWARE

// app.use((req,res,next)=>{
//     if(req.method==='GET'){
//         res.send('GET requests are disabled')
//     }
//     else{
//         next()

//     }
    
// })

// app.use((req,res,next)=>{
//     res.status(503).send('Sever down ! Work in progress');

// })

//FILE UPLOAD BASICS


// const multer=require('multer');
// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){
//         // if(!file.originalname.match(/\.(pdf)$/)){
//         //     return cb(new Error('Please upload PDF flle'))
//         // }

//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload word flle'))
//         }
//         cb(undefined,true)
//     }
// })
// app.post('/upload',upload.single('upload'),(req,res)=>{ //same name in postman key('upload')
//     res.send()
// })



app.use(express.json());
app.use(userRouter);
app.use(taskRouter);





app.listen(port, () => {
    console.log("Server is on the port !" + port);
})

// const Task=require('./models/task.js');
// const User=require('./models/user.js');
// const main=async()=>{
//     // const task=await Task.findById('5fda329dc733bb2e4450db44') ;
//     // await task.populate('owner').execPopulate();
//     // console.log(task);
//     // console.log(task.owner)
//     const user=await User.findById('5fda2e0c9c9e0c282c155bd9');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks)


// }
// main()


//HASHED PASSWORD


// const password = 'jewel1234@';
// const bycrypt = require('bcryptjs');
// const myHashPasswordFunction = async () => {
//     console.log("Password:", password);
//     const hashedPassword = await bycrypt.hash(password, 8)
//     console.log("Hashed Password:", hashedPassword);
//     const isMatch = await bycrypt.compare(password, hashedPassword);
//     console.log("Match:", isMatch);

// }
// myHashPasswordFunction();

//JSON WEB TOKEN
// const jwt=require('jsonwebtoken');
// const myJwtFunction=async()=>{
//     const token=jwt.sign({_id:'jewel123'},'learnnodejscourse',{expiresIn:'7 days'});
//     console.log("Token:",token);
//     const decodedData=jwt.verify(token,'learnnodejscourse');
//     console.log("Decoded Data:",decodedData);  

// }
// myJwtFunction();

//USER TASK REFERENCE

// const Task=require('./models/task.js');
// const User =require('./models/user.js');

// const main=async()=>{

    //Find user using Task Id
    // const task=await Task.findById('5feab5f07d6d5b3190f9e6c1');
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);


    
    //Find task using user id
//     const user=await User.findById('5feab4c37d6d5b3190f9e6bd');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);

// }
// main();









