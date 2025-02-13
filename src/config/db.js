// const mongoose = require("mongoose");
// require("dotenv").config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("✅ MongoDB Connected Successfully!");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Failed:", error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;



const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.error("❌ MongoDB connection string is missing. Check your .env file.");
  process.exit(1);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

// Event listeners for better debugging
mongoose.connection.on("connected", () => console.log("✅ MongoDB Connection Established"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB Connection Error:", err));
mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB Disconnected"));

module.exports = connectDB;
