// const errorHandler = (err, req, res, next) => {
//     const statusCode = res.statusCode < 400 ? 500 : res.statusCode;
    
//     res.status(statusCode).json({
//       success: false,
//       message: err.message || "Something went wrong",
//     });
//   };
  
//   module.exports = errorHandler;
  



const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
  }

  // Handle MongoDB Cast Errors (e.g., Invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    err.message = "Invalid resource ID format";
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Show stack trace only in development
  });

  console.error(`❌ Error (${statusCode}):`, err.message);
};

module.exports = errorHandler;
