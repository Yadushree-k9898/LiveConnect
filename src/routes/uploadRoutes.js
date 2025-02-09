
const express = require("express");
const cloudinary = require("../config/cloudinary"); // Make sure the path is correct
const router = express.Router();

// @desc    Upload image from URL
// @route   POST /api/upload/uploadByUrl
// @access  Public
router.post("/uploadByUrl", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "No image URL provided" });
    }

    console.log("🔹 Uploading image from URL:", imageUrl);

    // Upload image directly to Cloudinary
    const result = await cloudinary.uploader.upload(imageUrl, { folder: "user_uploads" });

    console.log("✅ Cloudinary Upload Success:", result);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("❌ Cloudinary Upload Failed:", error);
    res.status(500).json({ success: false, message: "Cloudinary Upload Failed", error: error.message || error });
  }
});

router.get("/testCloudinary", (req, res) => {
    try {
      console.log("✅ Cloudinary Object:", cloudinary);
      res.status(200).json({ success: true, message: "Cloudinary is working!" });
    } catch (error) {
      console.error("❌ Cloudinary Error:", error);
      res.status(500).json({ success: false, message: "Cloudinary Not Working", error });
    }
  });
  

module.exports = router;
