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
//     },
//     description: {
//       type: String,
//     },
//     date: {
//       type: Date,
//       required: [true, "Event date is required"],
//     },
//     location: {
//       type: String,
//       required: [true, "Event location is required"],
//     },
//     attendees: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//   },
//   { timestamps: true }
// );

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
      type: String,
      required: [true, "Event location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    maxAttendees: {
      type: Number,
      default: 100, // Default limit
      min: [1, "Minimum attendees should be 1"],
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

// Indexes for optimized querying
eventSchema.index({ user: 1, name: 1 }, { unique: true }); // Prevents duplicate events per user
eventSchema.index({ date: 1 });
eventSchema.index({ location: "text" });

// Virtual field to get the count of attendees
eventSchema.virtual("attendeeCount").get(function () {
  return this.attendees.length;
});

module.exports = mongoose.model("Event", eventSchema);
