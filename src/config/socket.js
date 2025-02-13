const { Server } = require("socket.io");

let io;

/**
 * Initializes WebSocket server
 * @param {Server} server - The HTTP server instance
 */
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this for production security
      methods: ["GET", "POST"],
    },
  });

  console.log("🚀 WebSocket server initialized");

  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    // User joins an event room
    socket.on("joinEvent", (eventId) => {
      socket.join(eventId);
      console.log(`👤 User ${socket.id} joined event ${eventId}`);
      io.to(eventId).emit("updateAttendees", { eventId, message: "New attendee joined!" });
    });

    // User leaves an event room
    socket.on("leaveEvent", (eventId) => {
      socket.leave(eventId);
      console.log(`👤 User ${socket.id} left event ${eventId}`);
      io.to(eventId).emit("updateAttendees", { eventId, message: "An attendee left!" });
    });

    // Handle disconnection
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
