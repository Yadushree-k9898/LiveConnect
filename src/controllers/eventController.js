
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary");
const { getIO } = require("../config/socket");

// ✅ Multer Setup (For Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private
 */
const createEvent = asyncHandler(async (req, res) => {
  const { name, description, date, location, maxAttendees } = req.body;

  if (!name || !date || !location) {
    return res.status(400).json({ success: false, message: "All required fields must be filled" });
  }

  let imageUrl = "https://via.placeholder.com/400"; // Default event image

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload_stream({ folder: "event_images" }, (error, result) => {
        if (error) throw error;
        imageUrl = result.secure_url;
      }).end(req.file.buffer);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }
  }

  const event = await Event.create({
    user: req.user.id,
    name,
    description,
    date,
    location,
    maxAttendees,
    image: imageUrl,
  });

  res.status(201).json({ success: true, message: "Event created successfully", event });
});

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().populate("user", "name email").select("-__v");

  res.status(200).json({ success: true, events });
});

/**
 * @desc    Get a single event
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("user", "name email");

  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  res.status(200).json({ success: true, event });
});

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private
 */
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ success: false, message: "Event not found" });

  if (event.user.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: "Not authorized to update this event" });
  }

  let imageUrl = event.image;

  if (req.file) {
    try {
      if (event.image && !event.image.includes("placeholder.com")) {
        const publicId = event.image.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(`event_images/${publicId}`);
      }

      const result = await cloudinary.uploader.upload_stream({ folder: "event_images" }, (error, result) => {
        if (error) throw error;
        imageUrl = result.secure_url;
      }).end(req.file.buffer);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }
  }

  Object.assign(event, req.body, { image: imageUrl });
  const updatedEvent = await event.save();

  res.status(200).json({ success: true, message: "Event updated successfully", event: updatedEvent });
});

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private
 */
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ success: false, message: "Event not found" });

  if (event.user.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: "Not authorized to delete this event" });
  }

  if (event.image && !event.image.includes("placeholder.com")) {
    const publicId = event.image.split("/").slice(-1)[0].split(".")[0];
    await cloudinary.uploader.destroy(`event_images/${publicId}`);
  }

  await event.deleteOne();
  res.status(200).json({ success: true, message: "Event deleted successfully" });
});

/**
 * @desc    Join an event (Real-time updates)
 * @route   POST /api/events/:id/join
 * @access  Private
 */
const joinEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });

  if (event.attendees.includes(req.user.id)) {
    return res.status(400).json({ success: false, message: "You have already joined this event" });
  }

  if (event.attendees.length >= event.maxAttendees) {
    return res.status(400).json({ success: false, message: "Event is full" });
  }

  event.attendees.push(req.user.id);
  await event.save();

  getIO().to(req.params.id).emit("updateAttendees", { eventId: req.params.id, message: "New attendee joined!" });

  res.status(200).json({ success: true, message: "Joined event successfully" });
});

/**
 * @desc    Leave an event (Real-time updates)
 * @route   DELETE /api/events/:id/leave
 * @access  Private
 */
const leaveEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });

  if (!event.attendees.includes(req.user.id)) {
    return res.status(400).json({ success: false, message: "You are not part of this event" });
  }

  event.attendees = event.attendees.filter((attendee) => attendee.toString() !== req.user.id);
  await event.save();

  getIO().to(req.params.id).emit("updateAttendees", { eventId: req.params.id, message: "An attendee left!" });

  res.status(200).json({ success: true, message: "Left event successfully" });
});


const getEventAttendees = asyncHandler(async (req, res) => {
  try {
    console.log("🔍 Fetching attendees for event:", req.params.id);

    const event = await Event.findById(req.params.id).populate(
      "attendees",
      "name email avatar"
    );

    if (!event) {
      console.log("❌ Event not found");
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    console.log("✅ Attendees fetched:", event.attendees.length);
    res.status(200).json({ success: true, attendees: event.attendees || [] });

  } catch (error) {
    console.error("❌ Error fetching attendees:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});



module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  upload,
  joinEvent,
  leaveEvent,
  getEventAttendees
};

