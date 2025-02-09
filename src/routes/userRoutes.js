// const express = require("express");
// const {
//   getUserProfile,
//   updateUserProfile,
//   deleteUserAccount,
//   getAllUsers,
// } = require("../controllers/userController"); // ✅ Make sure the path is correct

// const { protect } = require("../middlewares/authMiddleware"); // ✅ Ensure correct path

// const router = express.Router();

// // Protected routes (Require authentication)

// router.get("/", protect, getAllUsers);
// router.get("/profile", protect, getUserProfile); // Get user profile
// router.put("/profile", protect, updateUserProfile); // Update user profile
// router.delete("/delete", protect, deleteUserAccount); // Delete user account

// module.exports = router;






const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // Import Multer middleware for avatar upload

const router = express.Router();

// Protected routes (Require authentication)
router.get("/", protect, getAllUsers);
router.get("/profile", protect, getUserProfile); // Get user profile
router.put("/profile", protect, upload.single("avatar"), updateUserProfile); // Update profile with avatar
router.delete("/profile", protect, deleteUserAccount); // Delete user account (RESTful convention)

module.exports = router;
