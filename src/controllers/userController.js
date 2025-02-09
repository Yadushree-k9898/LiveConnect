const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const bcrypt = require("bcryptjs");

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: user,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/delete
 * @access  Private
 */
const deleteUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  await user.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "User account deleted successfully" });
});

/**
 * @desc    Fetch all users
 * @route   GET /api/users
 * @access  Private (Requires Authentication)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
module.exports = { getUserProfile, updateUserProfile, deleteUserAccount , getAllUsers}; // ✅ Ensure functions are exported
