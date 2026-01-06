const express= require("express")
const {getAllRecipes,getMyRecipes,getLikedRecipes,createRecipe,getRecipeById,updateRecipe,deleteRecipe}= require("../controller/recipe");
const {toggleLike}= require("../controller/likes");
const router= express.Router();
const {loginUser} = require("../controller/login");
const {registerUser} = require("../controller/register");
const { middleware } = require("../controller/middleware");

router.get("/recipe",middleware, getAllRecipes);
router.post("/recipe/:id/like",middleware,toggleLike);
router.post("/add",middleware, createRecipe);
router.get("/:id",getRecipeById);
router.put("/:id",updateRecipe);
router.delete("/:id",deleteRecipe);
router.post("/login",loginUser); 
router.post("/register",registerUser);
router.get("/users/me", middleware, (req, res) => {
  try {
    // middleware already attached user to req.user
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});
router.get("/users/my-recipes", middleware, getMyRecipes);
router.get("/users/liked-recipes", middleware, getLikedRecipes);



module.exports=router;