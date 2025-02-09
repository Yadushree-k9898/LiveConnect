// const Event = require('../models/Event');
// const asyncHandler = require('express-async-handler');

// // Middleware to check if the current user is the event owner
// const checkEventOwner = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;  // The event ID from the URL parameters

//   // Find the event in the database
//   const event = await Event.findById(id);

//   // If the event doesn't exist, return a 404
//   if (!event) {
//     return res.status(404).json({ success: false, message: 'Event not found' });
//   }

//   // Check if the user is the creator of the event (by comparing the user ID)
//   if (event.user.toString() !== req.user.id) {
//     return res.status(403).json({ success: false, message: 'You are not the event owner' });
//   }

//   // If the check passes, proceed with the next middleware or route handler
//   next();
// });

// module.exports = checkEventOwner;












const Event = require("../models/Event");
const asyncHandler = require("express-async-handler");

// Middleware to check if the user is the event owner
const checkEventOwner = asyncHandler(async (req, res, next) => {
  const { id } = req.params;  // Event ID from the route parameters

  // Find the event by ID
  const event = await Event.findById(id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Check if the current user is the event owner
  if (event.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized to perform this action" });
  }

  // Proceed to the next middleware or route handler
  next();
});

module.exports = checkEventOwner;
