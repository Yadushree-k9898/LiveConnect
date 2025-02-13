const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_EXPIRES_IN = "7d" } = process.env;

if (!JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET. Check your .env file.");
  process.exit(1);
}

/**
 * Hashes a password before storing it in the database.
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a provided password with a stored hashed password.
 * @param {string} password - User-provided password
 * @param {string} hashedPassword - Stored hashed password
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generates a JWT token for authentication.
 * @param {string} userId - User ID
 * @returns {string} - Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

module.exports = { hashPassword, comparePassword, generateToken };
