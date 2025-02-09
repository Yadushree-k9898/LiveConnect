// const asyncHandler = require("express-async-handler");
// const User = require("../models/User");

// const bcrypt = require("bcryptjs");

// /**
//  * @desc    Get user profile
//  * @route   GET /api/users/profile
//  * @access  Private
//  */
// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password");

//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   res.status(200).json({
//     success: true,
//     message: "User profile fetched successfully",
//     data: user,
//   });
// });

// /**
//  * @desc    Update user profile
//  * @route   PUT /api/users/profile
//  * @access  Private
//  */
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);

//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   user.name = req.body.name || user.name;
//   user.email = req.body.email || user.email;

//   if (req.body.password) {
//     user.password = await bcrypt.hash(req.body.password, 10);
//   }

//   const updatedUser = await user.save();

//   res.status(200).json({
//     success: true,
//     message: "Profile updated successfully",
//     data: {
//       _id: updatedUser.id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//     },
//   });
// });

// /**
//  * @desc    Delete user account
//  * @route   DELETE /api/users/delete
//  * @access  Private
//  */
// const deleteUserAccount = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);
//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   await user.deleteOne();
//   res
//     .status(200)
//     .json({ success: true, message: "User account deleted successfully" });
// });

// /**
//  * @desc    Fetch all users
//  * @route   GET /api/users
//  * @access  Private (Requires Authentication)
//  */
// const getAllUsers = asyncHandler(async (req, res) => {
//   try {
//     const users = await User.find().select("-password"); // Exclude passwords

//     res.status(200).json({
//       success: true,
//       message: "Users fetched successfully",
//       data: users,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
// module.exports = { getUserProfile, updateUserProfile, deleteUserAccount , getAllUsers}; // ✅ Ensure functions are exported








const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password").lean();

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

 */
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);

//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   user.name = req.body.name || user.name;
//   user.email = req.body.email || user.email;
//   user.avatar = req.body.avatar || user.avatar; // Allow avatar update

//   if (req.body.password) {
//     user.password = await bcrypt.hash(req.body.password, 10);
//   }

//   const updatedUser = await user.save();

//   res.status(200).json({
//     success: true,
//     message: "Profile updated successfully",
//     data: {
//       _id: updatedUser.id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       avatar: updatedUser.avatar, // Include avatar in response
//     },
//   });
// });




/**
 * @desc    Update user profile (including avatar upload)
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check if email is being updated & ensure it's unique
  if (req.body.email && req.body.email !== user.email) {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: "Email is already in use" });
    }
    user.email = req.body.email;
  }

  user.name = req.body.name || user.name;

  // Handle avatar upload to Cloudinary
  if (req.file) {
    // Upload new avatar to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      width: 200,
      height: 200,
      crop: "fill",
    });

    // Delete old avatar from Cloudinary if it's not the default one
    if (user.avatar && !user.avatar.includes("placeholder.com")) {
      const publicId = user.avatar.split("/").pop().split(".")[0]; // Extract public ID
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
    }

    user.avatar = result.secure_url; // Store new Cloudinary avatar URL
  }

  // Update password if provided
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }
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
      avatar: updatedUser.avatar, // Include new avatar URL
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

  res.status(200).json({
    success: true,
    message: "User account deleted successfully",
  });
});

/**
 * @desc    Fetch all users (Admin Only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
};
