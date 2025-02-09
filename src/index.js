



const express = require("express");
const http = require("http"); // Required for WebSockets
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const routes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow frontend connections
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Attach io instance to req object for real-time updates
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api", routes);

// Handle 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// Global Error Handler
app.use(errorHandler);

// WebSockets for Real-Time Attendee Updates
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins an event room
  socket.on("joinEvent", (eventId) => {
    socket.join(eventId);
    console.log(`User ${socket.id} joined event ${eventId}`);
    io.to(eventId).emit("updateAttendees", { eventId, message: "New attendee joined!" });
  });

  // User leaves an event room
  socket.on("leaveEvent", (eventId) => {
    socket.leave(eventId);
    console.log(`User ${socket.id} left event ${eventId}`);
    io.to(eventId).emit("updateAttendees", { eventId, message: "An attendee left!" });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
