const Like = require("../models/likes");
const Recipe = require("../models/recipe");
const redisClient = require("../config/redis");

const getAllRecipes = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const redisKey = `recipes:user:${userId}`;

    // 1️⃣ Check Redis first
    const cachedData = await redisClient.get(redisKey);
    if (cachedData) {
      console.log("⚡ Recipes from Redis");
      return res.json(JSON.parse(cachedData));
    }

    // 2️⃣ Fetch from MongoDB
    const recipes = await Recipe.find()
      .populate("author", "name");

    const likes = await Like.find({ user: userId });
    const likedSet = new Set(likes.map(l => l.recipe.toString()));

    const finalRecipes = recipes.map(recipe => ({
      ...recipe.toObject(),
      isLiked: likedSet.has(recipe._id.toString()),
    }));

    // 3️⃣ Store in Redis (10 minutes cache)
    await redisClient.setEx(
      redisKey,
      600,
      JSON.stringify(finalRecipes)
    );

    console.log("🗄️ Recipes from MongoDB");
    res.json(finalRecipes);

  } catch (error) {
    console.error("GET RECIPES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};


const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, description, steps, imageUrl } = req.body;

    if (
      !title ||
      !description ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // 🔑 IMPORTANT: req.user must exist
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newRecipe = new Recipe({
      title,
      ingredients,
      description,
      steps,
      imageUrl,
      author: req.user._id, // ✅ THIS LINE FIXES EVERYTHING
    });

    const savedRecipe = await newRecipe.save();
    await redisClient.del(`recipes:user:${userId}`);
    res.status(201).json({
      message: "Recipe created successfully",
      recipe: savedRecipe,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create recipe",
    });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get recipe by ID" });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, description, steps, imageUrl } = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        title,
        ingredients,
        description,
        steps,
        imageUrl
      },
      {
        new: true,        // return updated document
        runValidators: true
      }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
    await redisClient.del(`recipes:user:${userId}`);
     await redisClient.del(`myrecipes:user:${userId}`);


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update recipe" });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({
      message: "Recipe deleted successfully"
    });
    await redisClient.del(`recipes:user:${userId}`);
    await redisClient.del(`myrecipes:user:${userId}`);


  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete recipe"
    });
  }
};

const getMyRecipes = async (req, res) => {
  try {
    const userId = req.user._id;

    const recipes = await Recipe.find({ author: userId })
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    console.error("GET MY RECIPES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch my recipes" });
  }
};

const getLikedRecipes = async (req, res) => {
  try {
    const userId = req.user._id;

    const likes = await Like.find({ user: userId })
      .populate({
        path: "recipe",
        populate: { path: "author", select: "name" },
      });

    // Extract recipe objects
    const recipes = likes
      .map(like => like.recipe)
      .filter(Boolean); // safety

    res.json(recipes);
    

  } catch (error) {
    console.error("GET LIKED RECIPES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch liked recipes" });
  }
};

module.exports={
    getAllRecipes,
    createRecipe, 
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    getMyRecipes,
    getLikedRecipes
};