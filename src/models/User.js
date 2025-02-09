// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);
// module.exports = User;













const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    avatar: {
      type: String,
      default: "https://via.placeholder.com/150", // Default Avatar
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v); // Ensures it's a valid URL
        },
        message: "Invalid avatar URL",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bio: {
      type: String,
      maxlength: [200, "Bio must be less than 200 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
