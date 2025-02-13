

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
//       address: {
//         type: String,
//         required: [true, "Location address is required"],
//         trim: true,
//         maxlength: [200, "Location address cannot exceed 200 characters"],
//       },
//       coordinates: {
//         type: [Number], // [longitude, latitude]
//         required: true,
//         validate: {
//           validator: function (value) {
//             return Array.isArray(value) && value.length === 2;
//           },
//           message: "Coordinates must be an array of two numbers [longitude, latitude]",
//         },
//       },
//     },
//     maxAttendees: {
//       type: Number,
//       default: 100,
//       min: [1, "Minimum attendees should be 1"],
//     },
//     attendees: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     // image: {
//     //   type: String,
//     //   default: "",
//     // },
//     image: {
//       type: String,
//       required: [true, "Event image is required"],
//       default: "https://via.placeholder.com/400", 
      
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
// eventSchema.index({ user: 1, name: 1 });
// eventSchema.index({ date: 1 });

// // Virtual field to get the count of attendees
// eventSchema.virtual("attendeeCount").get(function () {
//   return this.attendees.length;
// });

// // Pre-save hook to check if the number of attendees exceeds the max limit
// eventSchema.pre("save", function (next) {
//   if (this.attendees.length > this.maxAttendees) {
//     next(new Error("Cannot add more attendees than the maximum limit"));
//   }
//   next();
// });

// // Function to update event status based on the current date
// const updateEventStatus = (event) => {
//   const now = new Date();
//   if (event.date > now) {
//     event.status = "upcoming";
//   } else if (event.date <= now && event.status === "upcoming") {
//     event.status = "ongoing";
//   } else if (event.date < now && event.status === "ongoing") {
//     event.status = "completed";
//   }
// };

// // Automatically update the event status before saving
// eventSchema.pre("save", function (next) {
//   updateEventStatus(this);
//   next();
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
      address: {
        type: String,
        required: [true, "Location address is required"],
        trim: true,
        maxlength: [200, "Location address cannot exceed 200 characters"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (value) {
            return Array.isArray(value) && value.length === 2;
          },
          message: "Coordinates must be an array of two numbers [longitude, latitude]",
        },
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
      required: [true, "Event image is required"],
      default: "https://via.placeholder.com/400",
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

// Indexes for optimized queries
eventSchema.index({ user: 1, name: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });

// Virtual field to get the count of attendees
eventSchema.virtual("attendeeCount").get(function () {
  return this.attendees.length;
});

/**
 * @desc Updates the event status based on the current date
 */
eventSchema.pre("save", function (next) {
  const now = new Date();

  if (this.date > now) {
    this.status = "upcoming";
  } else if (this.date <= now && this.date >= new Date(now.setHours(23, 59, 59))) {
    this.status = "ongoing";
  } else if (this.date < now) {
    this.status = "completed";
  }

  next();
});

module.exports = mongoose.model("Event", eventSchema);
