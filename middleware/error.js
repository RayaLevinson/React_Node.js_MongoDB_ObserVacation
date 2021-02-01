const ErrorResponse = require('../utils/errorResponse');
const { MAX_FILE_UPLOAD_SIZE_IN_BYTES } = require('../utils/validation/constants');
const {
  BAD_REQUEST, 
  NOT_FOUND, 
  SERVER_ERROR}  = require('../constValues/httpStatusCodes');

const errorHandler = (err, req, res, next) => {
  let error = {...err}
  error.message = err.message;

  // Log to console for developer
  console.log(err); 

  // Multer Error
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
        const message = `Please upload an image up to ${MAX_FILE_UPLOAD_SIZE_IN_BYTES} bytes`;
        error = new ErrorResponse(message, NOT_FOUND);
    }
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found.';
    error = new ErrorResponse(message, NOT_FOUND);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message;
    if (Object.keys(err.keyValue)[0] === 'email') {
      message = 'Email was already registered.' // Instead of message "Duplicate field value entered."
    } else {
        message = 'Duplicate field value entered.';
    }
    error = new ErrorResponse(message, BAD_REQUEST);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(value => value.message);
    error = new ErrorResponse(message, BAD_REQUEST);
  }

  res.status(error.statusCode || SERVER_ERROR).json({
    success: false,
    error: error.message || 'Server Error'
  });
}

module.exports = errorHandler;
