
const express = require("express");
const { registerUser, loginUser, guestLogin, logoutUser } = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiting for login-related routes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per window
  message: "Too many login attempts. Please try again later.",
});

// Public authentication routes
router.post("/register", registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/guest-login", authLimiter, guestLogin);
router.post("/logout", logoutUser);

module.exports = router;
