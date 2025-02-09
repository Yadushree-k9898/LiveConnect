// const mongoose = require("mongoose");

// const eventSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     name: {
//       type: String,
//       required: [true, "Event name is required"],
//       trim: true,
//       minlength: [3, "Event name must be at least 3 characters"],
//       maxlength: [100, "Event name cannot exceed 100 characters"],
//     },
//     description: {
//       type: String,
//       trim: true,
//       maxlength: [500, "Description cannot exceed 500 characters"],
//     },
//     date: {
//       type: Date,
//       required: [true, "Event date is required"],
//       validate: {
//         validator: function (value) {
//           return value > new Date();
//         },
//         message: "Event date must be in the future",
//       },
//     },
//     location: {
//       type: String,
//       required: [true, "Event location is required"],
//       trim: true,
//       maxlength: [200, "Location cannot exceed 200 characters"],
//     },
//     maxAttendees: {
//       type: Number,
//       default: 100, // Default limit
//       min: [1, "Minimum attendees should be 1"],
//     },
//     attendees: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     image: {
//       type: String, // Stores Cloudinary image URL
//       default: "", // Default empty if no image uploaded
//     },
//     status: {
//       type: String,
//       enum: ["upcoming", "ongoing", "completed"],
//       default: "upcoming",
//     },
//   },
//   { timestamps: true }
// );

// // Indexes for optimized querying
// eventSchema.index({ user: 1, name: 1 }); // Allows duplicate event names but speeds up queries
// eventSchema.index({ date: 1 });
// eventSchema.index({ location: "text" });

// // Virtual field to get the count of attendees
// eventSchema.virtual("attendeeCount").get(function () {
//   return this.attendees.length;
// });

// module.exports = mongoose.model("Event", eventSchema);







const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      minlength: [3, "Event name must be at least 3 characters"],
      maxlength: [100, "Event name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Event date must be in the future",
      },
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    maxAttendees: {
      type: Number,
      default: 100,
      min: [1, "Minimum attendees should be 1"],
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

// Indexes for optimized querying
eventSchema.index({ user: 1, name: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ location: "2dsphere" });

// Virtual field to get the count of attendees
eventSchema.virtual("attendeeCount").get(function () {
  return this.attendees.length;
});

// Pre-save hook to check if the number of attendees exceeds the max limit
eventSchema.pre('save', function (next) {
  if (this.attendees.length > this.maxAttendees) {
    next(new Error("Cannot add more attendees than the maximum limit"));
  }
  next();
});

// Function to update event status based on the current date
const updateEventStatus = (event) => {
  const now = new Date();
  if (event.date > now) {
    event.status = "upcoming";
  } else if (event.date <= now && event.status === "upcoming") {
    event.status = "ongoing";
  } else if (event.date < now && event.status === "ongoing") {
    event.status = "completed";
  }
};

// Automatically update the event status before saving
eventSchema.pre('save', function (next) {
  updateEventStatus(this);
  next();
});

module.exports = mongoose.model("Event", eventSchema);
