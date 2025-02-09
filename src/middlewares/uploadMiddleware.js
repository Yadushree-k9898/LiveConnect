



// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

// // Cloudinary Storage Configuration
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     const folder = file.fieldname === "avatar" ? "avatars" : "event-images"; // Dynamically assign folder

//     return {
//       folder,
//       allowed_formats: ["jpeg", "png", "jpg", "webp"], // Correct key
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

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log("🔍 Uploading file:", file.originalname); // Debugging log

    const folder = file.fieldname === "avatar" ? "avatars" : "event-images"; // Dynamically assign folder

    return {
      folder,
      allowed_formats: ["jpeg", "png", "jpg", "webp"], // Ensure correct formats
      transformation:
        file.fieldname === "avatar"
          ? [{ width: 200, height: 200, crop: "fill" }] // Resize avatars
          : [{ width: 500, height: 500, crop: "limit" }], // Resize event images
    };
  },
});

// Multer Upload Middleware
const upload = multer({ storage });

module.exports = upload;
