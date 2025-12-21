const express = require('express')
const User = require('../models/user')
const router =express.Router()
const jwt = require("jsonwebtoken");



router.post('/login' , async(req , res )=>{
    try{
  const {studentNum , password }= req.body

const user = await User.findOne({ studentNum: Number(studentNum) });
    console.log(user)
    if(!user){
      return  res.status(401).json({message: "الطالب غير موجود"})
    }
    if(user.password != password){
     return   res.status(401).json({message:"لتاكد من كلمة السر او الرقم الجامعي"})
    }
       // توليد Token
        const token = jwt.sign({ id: user._id , role: user.role  }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
    return  res.status(201).json({
        message:"تم تسجيل الدخول بنجاح",
        token,
        user:{id:user._id}
    })
    }
    catch(err){
        console.log(err)
      return  res.status(400).json({message:"حدث خطأ اثناء تسجيل الدخول  "})
    }

})

module.exports = router