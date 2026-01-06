const user= require("../models/user");

const registerUser= async(req,res)=>{
    const {name,email,password,profileImage}= req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"Please provide all required fields"});
    }
    const existingUser= await user.findOne({email});
    if(existingUser){
        return res.status(409).json({message:"User with this email already exists"});
    }
    const newUser= new user({
        name,
        email,
        password,
        profileImage
    });
    await newUser.save();
    res.status(201).json({message:"User registered successfully", user:newUser});
};
module.exports= {registerUser};