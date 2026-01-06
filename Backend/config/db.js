const mangoose = require('mongoose');
const dotenv= require('dotenv').config();
const connectDB=async()=>{
    try{
        await mangoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
    }catch(err){
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

module.exports=connectDB;