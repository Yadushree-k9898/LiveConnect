// const jwt = require("jsonwebtoken");

// const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// const verifyToken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };

// module.exports = { generateToken, verifyToken };



const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET, JWT_EXPIRES_IN = "7d" } = process.env;

if (!JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET. Check your .env file.");
  process.exit(1);
}

/**
 * Generate JWT Token
 * @param {string} userId - User ID for token payload
 * @returns {string} - Signed JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN, // Default is 7 days, can be overridden in .env
  });
};

/**
 * Verify JWT Token
 * @param {string} token - Token to verify
 * @returns {object|null} - Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("❌ Invalid or expired token:", error.message);
    return null; // Prevents crashes due to bad tokens
  }
};

module.exports = { generateToken, verifyToken };
