
// const express = require("express");
// const multer = require("multer");
// const cloudinary = require("../config/cloudinary");
// const router = express.Router();

// // Configure Multer for file upload (store in memory)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // @desc    Upload event image (User uploads a file)
// // @route   POST /api/upload/eventImage
// // @access  Private
// router.post("/eventImage", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     console.log("📸 Uploading event image:", req.file.originalname);

//     // Upload image buffer to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         { folder: "event_images" },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );
//       uploadStream.end(req.file.buffer);
//     });

//     console.log("✅ Upload Successful:", result.secure_url);

//     res.status(200).json({
//       success: true,
//       message: "Event image uploaded successfully",
//       imageUrl: result.secure_url,
//     });
//   } catch (error) {
//     console.error("❌ Cloudinary Upload Failed:", error);
//     res.status(500).json({ success: false, message: "Cloudinary Upload Failed", error: error.message || error });
//   }
// });

// module.exports = router;




const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // ✅ Import Multer config
const cloudinary = require("../config/cloudinary");

/**
 * @desc    Upload event image
 * @route   POST /api/upload/event
 * @access  Private (Requires authentication)
 */
router.post("/event", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    console.log("📸 Uploading event image:", req.file.originalname);

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "event_images" },
      (error, result) => {
        if (error) {
          throw new Error("Cloudinary upload failed");
        }
        res.status(200).json({
          success: true,
          message: "Event image uploaded successfully",
          imageUrl: result.secure_url,
        });
      }
    ).end(req.file.buffer);

  } catch (error) {
    console.error("❌ Cloudinary Upload Failed:", error);
    res.status(500).json({ success: false, message: error.message || "Cloudinary Upload Failed" });
  }
});

module.exports = router;


