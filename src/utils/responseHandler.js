/**
 * Sends a success response.
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object} data - Response data (optional)
 */
const sendSuccessResponse = (res, statusCode, message, data = {}) => {
    res.status(statusCode).json({ success: true, message, data });
  };
  
  /**
   * Sends an error response.
   * @param {Response} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   */
  const sendErrorResponse = (res, statusCode, message) => {
    res.status(statusCode).json({ success: false, message });
  };
  
  module.exports = { sendSuccessResponse, sendErrorResponse };
  