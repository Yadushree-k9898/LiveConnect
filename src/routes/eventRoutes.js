






// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middlewares/authMiddleware");
// const upload = require("../middlewares/uploadMiddleware");

// const {
//   createEvent,
//   getEvents,
//   getEventById,
//   updateEvent,
//   deleteEvent,
//   joinEvent,
//   leaveEvent,
// } = require("../controllers/eventController");

// // Public routes
// router.get("/", getEvents); // Get all events
// router.get("/:id", getEventById); // Get a specific event by ID

// // Protected routes (User must be authenticated)
// router.post("/", protect, upload.single("image"), createEvent); // Create event with image
// router.put("/:id", protect, upload.single("image"), updateEvent); // Update event (image optional)
// router.delete("/:id", protect, deleteEvent); // Delete event

// // Event participation routes
// router.post("/:id/join", protect, joinEvent); // Join an event
// router.delete("/:id/leave", protect, leaveEvent); // Leave an event

// module.exports = router;








const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware"); // Protect middleware to ensure user is authenticated
const upload = require("../middlewares/uploadMiddleware"); // Middleware for handling image uploads

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
} = require("../controllers/eventController");

// Public routes
router.get("/", getEvents); // Get all events
router.get("/:id", getEventById); // Get a specific event by ID

// Protected routes (User must be authenticated)
router.post("/", protect, upload.single("image"), createEvent); // Create event with image
router.put("/:id", protect, upload.single("image"), updateEvent); // Update event (image optional)
router.delete("/:id", protect, deleteEvent); // Delete event

// Event participation routes
router.post("/:id/join", protect, joinEvent); // Join an event
router.delete("/:id/leave", protect, leaveEvent); // Leave an event

module.exports = router;
