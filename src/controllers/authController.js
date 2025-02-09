const User = require("../models/User");
const bcrypt = require("bcryptjs");

const { generateToken } = require("../config/jwt");
const asyncHandler = require("express-async-handler");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      },
    });
  } else {
    return res.status(400).json({ success: false, message: "Invalid user data" });
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
