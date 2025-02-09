
const express = require("express");
const { registerUser, loginUser, guestLogin, logoutUser } = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware"); // Multer for handling image uploads
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiting for login-related routes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per window
  message: "Too many login attempts. Please try again later.",
});

// Public authentication routes
router.post("/register", upload.single("avatar"), registerUser); // ✅ Multer handles avatar upload
router.post("/login", authLimiter, loginUser);
router.post("/guest-login", authLimiter, guestLogin);
router.post("/logout", logoutUser);

module.exports = router;
