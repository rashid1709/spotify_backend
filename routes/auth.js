const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const {getToken} = require('../utils/helper');

router.post('/register', async (req,res)=>{
    //step 1
 const {email,password,firstname,lastname,username} = req.body;

 //step 2
 const user = await User.findOne({email:email});
 if(user) {
    return res.status(403).json({error:"A user with this email is already exists"});
 }
 //create new user step 3.1 we do not store password in plain text
 //we convert plain text password to hash
 const hashedPassword = await bcrypt.hash(password,10);
 const newUserData = 
 {email,
password: hashedPassword,
firstname,
lastname,
username
};
 const newUser= await User.create(newUserData);

 //step 4
 const token = await getToken(email,newUser);

 //step 5
 const userToReturn = {...newUser.toJSON(),token};
 delete userToReturn.password;
 return res.status(200).json(userToReturn);
});

router.post('/login', async (req,res)=>{
   const {email,password} = req.body;
   const user = await User.findOne({email:email});
   if(!user){
      return res.status(403).json({err:"Invalid Credential"});

   }

   const isPasswordValid = await bcrypt.compare(password,user.password);
   if(!isPasswordValid) {
      return res.status(403).json({err:"Invalid Password Credential"});
   }
   const token = await getToken(user.email,user);
   const userToReturn = {...user.toJSON(),token};
   delete userToReturn.password;
   return res.status(200).json(userToReturn);
})

module.exports = router;