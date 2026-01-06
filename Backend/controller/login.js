const User= require("../models/user");
const jwt= require("jsonwebtoken");
const dotenv= require("dotenv").config();
const loginUser= async(req,res)=>{
    const {email,password}= req.body;
    if(!email || !password){
        return res.status(400).json({message:"Please provide email and password"});
    }
    const existingUser= await User.findOne({email});
    if(!existingUser){
        return res.status(400).json({message:"Invalid email or password"});
    }
    if(existingUser.password!== password){
        return res.status(400).json({message:"Invalid email or password"});
    }
     const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({message:"Login successful",token});
}

module.exports= {loginUser};