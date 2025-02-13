

// const asyncHandler = require("express-async-handler");
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const cloudinary = require("../config/cloudinary");

// /**
//  * @desc    Get user profile
//  * @route   GET /api/users/profile
//  * @access  Private
//  */
// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id).select("-password").lean();

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
//  * @desc    Update user profile (name & avatar upload)
//  * @route   PUT /api/users/profile
//  * @access  Private
//  */
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);

//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   user.name = req.body.name || user.name;

//   // Handle avatar upload to Cloudinary
//   if (req.file) {
//     try {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "avatars",
//         width: 200,
//         height: 200,
//         crop: "fill",
//       });

//       // Remove old avatar if not the default one
//       if (user.avatar && !user.avatar.includes("placeholder.com")) {
//         const publicId = user.avatar.split("/").pop().split(".")[0];
//         await cloudinary.uploader.destroy(`avatars/${publicId}`);
//       }

//       user.avatar = result.secure_url;
//     } catch (error) {
//       return res.status(500).json({ success: false, message: "Avatar upload failed" });
//     }
//   }

//   const updatedUser = await user.save();

//   res.status(200).json({
//     success: true,
//     message: "Profile updated successfully",
//     data: {
//       _id: updatedUser.id,
//       name: updatedUser.name,
//       avatar: updatedUser.avatar, // Include new avatar URL
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

//   res.status(200).json({
//     success: true,
//     message: "User account deleted successfully",
//   });
// });

// module.exports = {
//   getUserProfile,
//   updateUserProfile,
//   deleteUserAccount,
// };




const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");

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
 * @desc    Update user profile (name & avatar upload)
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.name = req.body.name || user.name;

  // Handle avatar upload to Cloudinary
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        width: 200,
        height: 200,
        crop: "fill",
      });

      // Remove old avatar if it exists and is not a placeholder
      if (user.avatar && !user.avatar.includes("placeholder.com")) {
        try {
          const publicId = user.avatar.split("/").slice(-1)[0].split(".")[0]; // Extracts publicId
          await cloudinary.uploader.destroy(`avatars/${publicId}`);
        } catch (error) {
          console.error("❌ Error deleting old avatar:", error.message);
        }
      }

      user.avatar = result.secure_url;
    } catch (error) {
      return res.status(500).json({ success: false, message: "Avatar upload failed" });
    }
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      _id: updatedUser.id,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    },
  });
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/profile
 * @access  Private
 */
const deleteUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Delete avatar from Cloudinary if not a placeholder
  if (user.avatar && !user.avatar.includes("placeholder.com")) {
    try {
      const publicId = user.avatar.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
    } catch (error) {
      console.error("❌ Error deleting avatar:", error.message);
    }
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User account deleted successfully",
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
};

