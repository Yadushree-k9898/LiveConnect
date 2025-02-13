

// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const asyncHandler = require("express-async-handler");

// const protect = asyncHandler(async (req, res, next) => {
//   const token = req.headers.authorization?.startsWith("Bearer")
//     ? req.headers.authorization.split(" ")[1]
//     : null;

//   console.log("🔍 Received Token:", token || "No Token Provided"); // ✅ Debugging token in backend

//   if (!token) {
//     return res.status(401).json({ success: false, message: "Not authorized, token missing" });
//   }

//   try {
//     // Verify JWT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("✅ Token Decoded:", decoded); // ✅ Log decoded token payload

//     // Find user in the database
//     req.user = await User.findById(decoded.id).select("-password");

//     if (!req.user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     next(); // Continue to the next middleware
//   } catch (error) {
//     console.error("❌ Token Error:", error.message);

//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
//     }

//     return res.status(403).json({ success: false, message: "Invalid token" });
//   }
//   console.log("🔍 Received Token:", token || "No Token Provided");

// });

// module.exports = { protect };





const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET. Check your .env file.");
  process.exit(1);
}

/**
 * @desc    Protect routes - Only allow authenticated users
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, token missing" });
  }

  try {
    // Verify JWT Token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user & attach to request object
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error("❌ JWT Error:", error.message);

    const message =
      error.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Invalid token";

    return res.status(401).json({ success: false, message });
  }
});

module.exports = { protect };
