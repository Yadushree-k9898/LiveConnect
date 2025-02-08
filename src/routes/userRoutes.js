const express = require("express");
const { getUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getUserProfile);

module.exports = router;
