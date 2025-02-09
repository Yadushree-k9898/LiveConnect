
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const asyncHandler = require("express-async-handler");

// const protect = asyncHandler(async (req, res, next) => {
//   let token = req.headers.authorization?.startsWith("Bearer") 
//     ? req.headers.authorization.split(" ")[1] 
//     : null;

//   if (!token) {
//     return res.status(401).json({ success: false, message: "Not authorized, token missing" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");

//     if (!req.user) {
//       return res.status(403).json({ success: false, message: "User not found" });
//     }

//     next();
//   } catch (error) {
//     return res.status(403).json({ success: false, message: "Invalid or expired token" });
//   }
// });

// module.exports = { protect };







const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer") 
    ? req.headers.authorization.split(" ")[1] 
    : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired, please login again" });
    }
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
});

// Admin Middleware
const admin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };




