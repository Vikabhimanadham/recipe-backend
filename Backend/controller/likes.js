const Like = require("../models/likes");
const redisClient = require("../config/redis");
const Recipe = require("../models/recipe");

const toggleLike = async (req, res) => {
    console.log("🔥 toggleLike file loaded");

  try {
    const { id } = req.params; // recipeId
    const userId = req.user._id;
     console.log("RECIPE ID:", id);
    console.log("USER ID:", userId);
    const existingLike = await Like.findOne({
      recipe: id,
      user: userId,
    });
 
    if (existingLike) { 
      // UNLIKE
      await existingLike.deleteOne();
      await Recipe.findByIdAndUpdate(id, { $inc: { likesCount: -1 } });
      await redisClient.del(`recipes:user:${userId}`);
      await redisClient.del(`myrecipes:user:${userId}`);
      return res.json({ liked: false });
    } else {
      // LIKE
      await Like.create({
        recipe: id,
        user: userId,
      });

      await Recipe.findByIdAndUpdate(id, { $inc: { likesCount: 1 } });
        await redisClient.del(`recipes:user:${userId}`);
      await redisClient.del(`myrecipes:user:${userId}`);
      return res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Like failed" });
  }
};

module.exports = {toggleLike};
