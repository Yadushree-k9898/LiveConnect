

const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // ✅ Correct import

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getEventAttendees,
} = require("../controllers/eventController"); // ✅ Ensure all these functions exist!

const router = express.Router();

// ✅ Public Routes
router.get("/", getEvents);
router.get("/:id", getEventById);
router.get("/:id/attendees", getEventAttendees);

// ✅ Protected Routes
router.post("/", protect, upload.single("image"), createEvent);
router.patch("/:id", protect, upload.single("image"), updateEvent);
router.delete("/:id", protect, deleteEvent);

// ✅ Event Participation Routes
router.post("/:id/join", protect, joinEvent);
router.delete("/:id/leave", protect, leaveEvent);

module.exports = router;

