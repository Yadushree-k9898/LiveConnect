


const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
} = require("../controllers/eventController");
const upload = require("../middlewares/uploadMiddleware");

// Public routes
router.route("/").get(getEvents);
router.route("/:id").get(getEventById);
router.post("/", protect, upload.single("image"), createEvent);

// Protected routes
router.route("/").post(protect, createEvent);
router.route("/:id").put(protect, updateEvent).delete(protect, deleteEvent);
router.route("/:id/join").post(protect, joinEvent);
router.route("/:id/leave").delete(protect, leaveEvent);

module.exports = router;
