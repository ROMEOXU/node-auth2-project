const express = require('express');
const server =  express();
const Users = require('./user-model');
const bcrypt = require('bcryptjs');
const useMiddleware = require('./restrict');
const jwt = require('jsonwebtoken');
const cors = require('cors');
server.use(express.json());
server.use(cors());
const PORT = process.env.PORT || 5300;

server.use((err,req,res,next)=>{
    res.status(500).json({
        message:'sth went wrong'
    })
})

server.post('/api/register',async (req,res,next)=>{
  try{
      const {username,password,department} = req.body
      const user = await Users.findBy({username}).first()
      if(user){
        res.status(409).json({
            message:'user name already taken'
        })  
      }
    const newUser = await Users.add({
        username,
        department,
        password:await bcrypt.hash(password,10)
        
    })
    res.status(201).json(newUser)
  }catch(err){
      next(err)
  }
})


server.post('/api/login',async (req,res,next)=>{
    try{
      const {username,password}= req.body
      const user = await Users.findBy({username}).first()
     if(!user){
         return res.status(401).json({
             message:'invalid user'
         })
     }
     const passWordValid = await bcrypt.compare(password,user.password)
     if (!passWordValid){
        return res.status(401).json({
            message:'invalid user'
        })
     }
    //  req.session.user = user
    const token = jwt.sign({
        userID: user.id,
        userRole:"admin",
    },process.env.JWT_SECRET)
    res.json({
         message:`welcome back ${user.username}`,
         token:token
     })
    }catch(err){
     next(err)
    }
    

})

server.get('/api/users',useMiddleware.restrict('admin'),async (req,res,next)=>{
 try{
     res.status(201).json( await Users.find())}
 catch(err){
     next(err)
 }
})

server.get('/api/logout',async (req,res,next)=>{
  try{
    req.session.destroy((err) => {
        if (err) {
            next(err)
        } else {
            res.status(204).end()
        }
    })
  }catch(err){
      next(err)
  }
})

server.get('/',(req,res)=>{
res.send('romeo is building API here')
})

server.listen(PORT,()=>{
    console.log(`now you are listening on ${PORT}`)
})