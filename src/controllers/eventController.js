






const Event = require("../models/Event");
const asyncHandler = require("express-async-handler");

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
    const { name, description, date, location, maxAttendees } = req.body;
  
    if (!name || !date || !location) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if the event date is in the future
    if (new Date(date) < new Date()) {
      return res.status(400).json({ message: "Event date must be in the future" });
    }
  
    // Check if the event already exists for the same user
    const existingEvent = await Event.findOne({ 
      user: req.user.id, 
      name, 
      date, 
      location, 
      image: imageUrl,
      
    });
  
    if (existingEvent) {
      return res.status(400).json({ message: "Event already exists" });
    }
  
    // Create a new event if not duplicate
    const event = await Event.create({
      user: req.user.id,
      name,
      description,
      date,
      location,
      maxAttendees: maxAttendees || 100, // Default value if not provided
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
    .select("-__v"); // Exclude version key
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

  // Prevent past event date updates
  if (req.body.date && new Date(req.body.date) < new Date()) {
    return res.status(400).json({ message: "Event date cannot be in the past" });
  }

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate("user", "name email")
    .populate("attendees", "name email");

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
// const joinEvent = asyncHandler(async (req, res) => {
//   const event = await Event.findById(req.params.id);

//   if (!event) {
//     return res.status(404).json({ message: "Event not found" });
//   }

//   if (event.attendees.includes(req.user.id)) {
//     return res.status(400).json({ message: "You have already joined this event" });
//   }

//   if (event.attendees.length >= event.maxAttendees) {
//     return res.status(400).json({ message: "Event is full" });
//   }

//   event.attendees.push(req.user.id);
//   await event.save();

//   res.status(200).json({ message: "Joined event successfully", event });
// });

// // @desc    Leave an event
// // @route   DELETE /api/events/:id/leave
// // @access  Private
// const leaveEvent = asyncHandler(async (req, res) => {
//   const event = await Event.findById(req.params.id);

//   if (!event) {
//     return res.status(404).json({ message: "Event not found" });
//   }

//   if (!event.attendees.includes(req.user.id)) {
//     return res.status(400).json({ message: "You are not part of this event" });
//   }

//   event.attendees = event.attendees.filter(attendee => attendee.toString() !== req.user.id);
//   await event.save();

//   res.status(200).json({ message: "Left event successfully", event });
// });












// @desc    Join an event as an attendee
// @route   POST /api/events/:id/join
// @access  Private
const joinEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  let imageUrl = req.file ? req.file.path : ""; 

  if (!event) return res.status(404).json({ message: "Event not found" });

  if (event.attendees.includes(req.user.id)) {
    return res.status(400).json({ message: "You have already joined this event" });
  }

  if (event.attendees.length >= event.maxAttendees) {
    return res.status(400).json({ message: "Event is full" });
  }

  event.attendees.push(req.user.id);
  await event.save();

  // Emit real-time update
  req.io.to(event._id.toString()).emit("updateAttendees", {
    eventId: event._id,
    attendees: event.attendees.length,
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

  // Emit real-time update
  req.io.to(event._id.toString()).emit("updateAttendees", {
    eventId: event._id,
    attendees: event.attendees.length,
  });

  res.status(200).json({ message: "Left event successfully", attendees: event.attendees.length });
});

module.exports = { joinEvent, leaveEvent };


module.exports = { 
  createEvent, 
  getEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent, 
  joinEvent, 
  leaveEvent 
};
