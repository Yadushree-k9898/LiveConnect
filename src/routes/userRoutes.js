// const express = require("express");
// const {
//   getUserProfile,
//   updateUserProfile,
//   deleteUserAccount,
//   getAllUsers,
// } = require("../controllers/userController");

// const { protect } = require("../middlewares/authMiddleware");
// const upload = require("../middlewares/uploadMiddleware"); // Import Multer middleware for avatar upload

// const router = express.Router();

// // Protected routes (Require authentication)
// router.get("/users", protect, getAllUsers);

// router.get("/profile", protect, getUserProfile); // Get user profile
// router.put("/profile", protect, upload.single("avatar"), updateUserProfile); // Update profile with avatar
// router.delete("/profile", protect, deleteUserAccount); // Delete user account (RESTful convention)

// module.exports = router;



const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount

} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); 

const router = express.Router();

// ✅ Protected Routes (Require authentication)

router.get("/profile", protect, getUserProfile); // Get logged-in user profile
router.put("/profile", protect, upload.single("avatar"), updateUserProfile); // Update profile with avatar
router.delete("/profile", protect, deleteUserAccount); // Delete user account

module.exports = router;


