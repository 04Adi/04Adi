const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWt_SECRET ='Harryisagoodb$oy';
// ROUTE 1 create a user using:Post"/api/auth".doesnt require auth.
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'password must be atleast 5 characters').isLength({ min: 5 }),
], async(req, res) => {
  // if there is an error,return Bad request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try{
    // check whether thr user with the email exists already
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ error: "sorry a user with this email already exist" })
  }
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);

  user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: secPass,
  });
  const data ={
    user:{
      id:user.id
    }
  }
  const authtoken = jwt.sign(data , JWt_SECRET);
  //console.log(jwyData);
     // res.json(user)
      res.json({authtoken})
}

     catch (error){
      console.error(error.message);
      rss.status(500).send("Some Error occured");
     }

    })
    // Rout2

    router.post('/login', [
      body('email', 'Enter a valid email').isEmail(),
      body('password','Password Cannot be blank').exists(),
    ],async(req , res)=>{
     const errors = validationResult(req);
     if(!errors.isEmpty()){
      return res.status(400).json({error:errors.array()});
    }
    const {email,password}= req.body;
try{
  let user= await User.findOne({email});
  if(!user){
     return res.status(400).json({error:"Please try to login with correct credential "});
  }
  const passwordCompare = await bcrypt.compare(password,user.password);
  if (!passwordCompare){
    return res.status(400).json({error:"Please try to login with correct credential "});
  }
   const data ={
    user:{
      id: user.id
    }
   }
   const authtoken = jwt.sign(data , JWt_SECRET);
   res.json({authtoken})

}catch (error){
      console.error(error.message);
      res.status(500).send("Internal Server Error");
}

});
// Route 3: get loggedin user details using : POST "api/auth/gesture".login required
router.post('/getuser',fetchuser, async(req , res)=>{

try{
   const userId = req.user.id;
   const user = await User.findById(userId).select("-password")
  res.send(user)
}catch(error){
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}
})
module.exports = router
