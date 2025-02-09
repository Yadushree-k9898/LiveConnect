const axios = require("axios");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

/**
 * @desc    Register a new user (Supports File Upload & Image URL)
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  console.log("📦 Request Body:", req.body);
  console.log("📸 Uploaded File:", req.file);

  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let avatarUrl = "https://via.placeholder.com/150"; // Default avatar

  if (req.file) {
    try {
      console.log("🚀 Uploading avatar to Cloudinary...");
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        width: 200,
        height: 200,
        crop: "fill",
      });
      avatarUrl = result.secure_url;
      console.log("✅ Avatar uploaded:", avatarUrl);
    } catch (error) {
      console.error("❌ Cloudinary Upload Error:", error);
      return res.status(500).json({ success: false, message: "Avatar upload failed" });
    }
  } else if (avatar) {
    try {
      console.log("🌐 Fetching avatar from URL:", avatar);
      
      // Generate a unique filename
      const tempFilePath = path.join(__dirname, `${uuidv4()}.jpg`);

      // Download the image from the URL
      const response = await axios({
        url: avatar,
        responseType: "arraybuffer",
      });

      fs.writeFileSync(tempFilePath, response.data); // Save it locally

      console.log("🚀 Uploading fetched avatar to Cloudinary...");
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: "avatars",
        width: 200,
        height: 200,
        crop: "fill",
      });

      avatarUrl = result.secure_url;
      console.log("✅ Avatar URL uploaded successfully:", avatarUrl);

      fs.unlinkSync(tempFilePath); // Remove temporary file
    } catch (error) {
      console.error("❌ Cloudinary Upload Error (URL):", error);
      return res.status(500).json({ success: false, message: "Failed to upload avatar URL" });
    }
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar: avatarUrl,
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user.id),
      },
    });
  } else {
    res.status(500).json({ success: false, message: "User registration failed" });
  }
});

/**
 * @desc    Login a user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    },
  });
});

/**
 * @desc    Guest login
 * @route   POST /api/auth/guest-login
 * @access  Public
 */
const guestLogin = asyncHandler(async (req, res) => {
  const guestUser = {
    name: "Guest User",
    email: `guest_${Date.now()}@example.com`,
  };

  res.status(200).json({
    success: true,
    message: "Guest login successful",
    data: {
      name: guestUser.name,
      email: guestUser.email,
      token: generateToken(guestUser.email),
    },
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "User logged out successfully" });
});

module.exports = { registerUser, loginUser, guestLogin, logoutUser }; // ✅ Ensure functions are exported
