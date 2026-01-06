const express= require("express")
const app= express();
const dotenv= require("dotenv");
const connectDB= require("./config/db");
require("./config/redis");
const recipeRoutes= require("./routes/recipe");
const cors= require("cors");
app.use(cors("*S"));
dotenv.config();
connectDB();
app.use(express.json());


app.use("/api/recipes",recipeRoutes);


const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>{ 
    console.log(`Server is running on port ${PORT}`);
});
   