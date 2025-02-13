

const axios = require("axios");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const cloudinary = require("../config/cloudinary");

/**
 * @desc    Register a new user (Supports File Upload & Image URL)
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
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
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        width: 200,
        height: 200,
        crop: "fill",
      });
      avatarUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ success: false, message: "Avatar upload failed" });
    }
  } else if (avatar) {
    avatarUrl = avatar; // Directly use the provided avatar URL
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
      avatar: user.avatar,
      token: generateToken(user.id),
      expiresIn: "7d", // JWT Expiration
    },
  });
});

/**
 * @desc    Guest login (Limited Access)
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
      token: generateToken(guestUser.email), // Using email as a unique identifier
      expiresIn: "24h", // Guest token expires in 24 hours
    },
  });
});

/**
 * @desc    Logout user (Handled client-side by removing token)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "User logged out successfully" });
});

module.exports = { registerUser, loginUser, guestLogin, logoutUser };


