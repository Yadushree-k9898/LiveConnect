
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

// // Cloudinary Storage Configuration
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     console.log("🔍 Uploading file:", file.originalname); // Debugging log

//     const folder = file.fieldname === "avatar" ? "avatars" : "event-images"; // Dynamically assign folder

//     return {
//       folder,
//       allowed_formats: ["jpeg", "png", "jpg", "webp"], // Ensure correct formats
//       transformation:
//         file.fieldname === "avatar"
//           ? [{ width: 200, height: 200, crop: "fill" }] // Resize avatars
//           : [{ width: 500, height: 500, crop: "limit" }], // Resize event images
//     };
//   },
// });

// // Multer Upload Middleware
// const upload = multer({ storage });

// module.exports = upload;


const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Allowed file types
const allowedFormats = ["jpeg", "jpg", "png", "webp"];

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = file.fieldname === "avatar" ? "avatars" : "event-images";

    return {
      folder,
      allowed_formats: allowedFormats,
      transformation:
        file.fieldname === "avatar"
          ? [{ width: 200, height: 200, crop: "fill" }] // Resize avatars
          : [{ width: 800, height: 800, crop: "limit" }], // Resize event images
    };
  },
});

// Multer File Filter (Ensures only images are uploaded)
const fileFilter = (req, file, cb) => {
  if (allowedFormats.includes(file.mimetype.split("/")[1])) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, JPG, PNG, and WEBP are allowed."), false);
  }
};

// Multer Upload Middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

module.exports = upload;


