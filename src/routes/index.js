
const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const eventRoutes = require("./eventRoutes");
const uploadRoutes = require("./uploadRoutes");

const router = express.Router();

// ✅ API Health Check
router.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Event Management API is running!" });
});

// ✅ Route Definitions
router.use("/auth", authRoutes);  // 🔹 Authentication Routes
router.use("/users", userRoutes); // 🔹 User Management Routes
router.use("/events", eventRoutes); // 🔹 Event Management Routes
router.use("/upload", uploadRoutes); // 🔹 File Upload Routes

module.exports = router;
