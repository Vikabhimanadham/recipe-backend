const User = require("../models/user");
const jwt = require("jsonwebtoken");

const middleware = async (req, res, next) => {
  try {
    // ✅ Read token from custom header
    const token = req.headers["x-token"];

    if (!token) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid authorization token",
    });
  }
};

module.exports = { middleware };
