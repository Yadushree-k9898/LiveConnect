// const cloudinary = require("cloudinary").v2;
// require("dotenv").config();

// // Ensure Cloudinary credentials are available
// if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
//   console.error("❌ Cloudinary configuration missing. Check your .env file.");
//   process.exit(1);
// }

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

// console.log("✅ Cloudinary Configured");

// module.exports = cloudinary;



const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Validate Cloudinary credentials
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("❌ Cloudinary configuration missing. Please check your .env file.");
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true, // Ensures HTTPS secure URLs
});

console.log("✅ Cloudinary successfully configured!");

module.exports = cloudinary;
