const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes);



module.exports = router;
