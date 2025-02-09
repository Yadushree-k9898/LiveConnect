
const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const eventRoutes = require("./eventRoutes");
const uploadRoutes = require("./uploadRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes); 
router.use("/events", eventRoutes); 
router.use("/upload", uploadRoutes);

module.exports = router;
