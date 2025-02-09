
const Event = require("../models/Event");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");



// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  const { name, description, date, location, maxAttendees } = req.body;

  // Validate input fields
  if (!name || !date || !location || !location.coordinates) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  if (new Date(date) < new Date()) {
    return res.status(400).json({ message: "Event date must be in the future" });
  }

  // Check for duplicate event based on name, date, and location coordinates
  const existingEvent = await Event.findOne({
    user: req.user.id,
    name,
    date,
    "location.coordinates": location.coordinates,  // Ensure coordinates are checked
  });

  if (existingEvent) {
    return res.status(400).json({
      message: "Event already exists with the same name, date, and location",
    });
  }

  let imageUrl = "";
  if (req.file) {
    try {
      console.log("📸 Uploading event image:", req.file.originalname);
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "event_images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ message: "Image upload failed", error: error.message });
    }
  }

  const event = await Event.create({
    user: req.user.id,
    name,
    description,
    date,
    location,
    maxAttendees: maxAttendees || 100,
    image: imageUrl,
  });

  res.status(201).json(event);
});




// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find()
    .populate("user", "name email")
    .populate("attendees", "name email")
    .select("-__v");

  res.status(200).json(events);
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("user", "name email")
    .populate("attendees", "name email");

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.status(200).json(event);
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  let imageUrl = event.image;
  if (req.file) {
    try {
      console.log("📸 Updating event image:", req.file.originalname);
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "event_images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ message: "Image upload failed", error: error.message });
    }
  }

  event.name = req.body.name || event.name;
  event.description = req.body.description || event.description;
  event.date = req.body.date || event.date;
  event.location = req.body.location || event.location;
  event.image = imageUrl;

  const updatedEvent = await event.save();

  res.status(200).json(updatedEvent);
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await event.deleteOne();
  res.status(200).json({ message: "Event removed" });
});

// @desc    Join an event as an attendee
// @route   POST /api/events/:id/join
// @access  Private
const joinEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ message: "Event not found" });

  if (event.attendees.includes(req.user.id)) {
    return res.status(400).json({ message: "You have already joined this event" });
  }

  if (event.attendees.length >= event.maxAttendees) {
    return res.status(400).json({ message: "Event is full" });
  }

  event.attendees.push(req.user.id);
  await event.save();

  req.io.to(event._id.toString()).emit("updateAttendees", {
    eventId: event._id,
    attendees: event.attendees.length,
    user: req.user.name,
    action: 'joined'
  });

  res.status(200).json({ message: "Joined event successfully", attendees: event.attendees.length });
});

// @desc    Leave an event
// @route   DELETE /api/events/:id/leave
// @access  Private
const leaveEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ message: "Event not found" });

  if (!event.attendees.includes(req.user.id)) {
    return res.status(400).json({ message: "You are not part of this event" });
  }

  event.attendees = event.attendees.filter(attendee => attendee.toString() !== req.user.id);
  await event.save();

  req.io.to(event._id.toString()).emit("updateAttendees", {
    eventId: event._id,
    attendees: event.attendees.length,
    user: req.user.name,
    action: 'left'
  });

  res.status(200).json({ message: "Left event successfully", attendees: event.attendees.length });
});

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
};




