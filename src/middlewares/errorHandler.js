const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode < 400 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  };
  
  module.exports = errorHandler;
  