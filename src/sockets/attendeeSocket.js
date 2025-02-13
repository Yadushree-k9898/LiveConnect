// const { getIO } = require("../config/socket");

// /**
//  * Emits a real-time update when an attendee joins an event.
//  * @param {string} eventId - Event ID
//  */
// const notifyAttendeeJoined = (eventId) => {
//   getIO().to(eventId).emit("updateAttendees", { eventId, message: "A new attendee joined!" });
// };

// /**
//  * Emits a real-time update when an attendee leaves an event.
//  * @param {string} eventId - Event ID
//  */
// const notifyAttendeeLeft = (eventId) => {
//   getIO().to(eventId).emit("updateAttendees", { eventId, message: "An attendee left!" });
// };

// module.exports = { notifyAttendeeJoined, notifyAttendeeLeft };



const { Server } = require("socket.io");

let io;

/**
 * Initializes WebSocket server
 * @param {Server} server - The HTTP server instance
 */
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", process.env.FRONTEND_URL],
      methods: ["GET", "POST"],
    },
  });

  console.log("🚀 WebSocket server initialized");

  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    socket.on("joinEvent", (eventId) => {
      socket.join(eventId);
      console.log(`👤 User ${socket.id} joined event ${eventId}`);
      io.to(eventId).emit("updateAttendees", { eventId, message: "New attendee joined!" });
    });

    socket.on("leaveEvent", (eventId) => {
      socket.leave(eventId);
      console.log(`👤 User ${socket.id} left event ${eventId}`);
      io.to(eventId).emit("updateAttendees", { eventId, message: "An attendee left!" });
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Returns the Socket.IO instance
 * @returns {Server} io - The Socket.IO instance
 */
const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
