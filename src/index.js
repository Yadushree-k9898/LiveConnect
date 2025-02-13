

const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const connectDB = require("./config/db");
const routes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { initializeSocket } = require("./sockets/attendeeSocket");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ CORS Configuration (Supports Multiple Frontends)
const corsOptions = {
  origin: ["http://localhost:5173", process.env.FRONTEND_URL], // Update for production
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// ✅ Security & Performance Middlewares
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api", routes);

// ✅ Handle 404 Not Found
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// ✅ Global Error Handler
app.use(errorHandler);

// ✅ Initialize WebSockets
initializeSocket(server);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
