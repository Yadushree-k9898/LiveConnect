const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./routes/index");
const { protect } = require("./middlewares/authMiddleware");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", routes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
