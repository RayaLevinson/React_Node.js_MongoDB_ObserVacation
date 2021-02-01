const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { isLoginInputValid } = require ('../utils/validation/userValidation');

const { 
  OK,
  BAD_REQUEST,
  NOT_AUTHENTICATED, 
  SERVER_ERROR 
} = require('../constValues/httpStatusCodes');

// @route   POST /api/users/auth/login
// @desc    Handle user login, auth user
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  const errors = [];
  if (! isLoginInputValid(req.body, errors)) {
    return next(new ErrorResponse(errors.join(','), BAD_REQUEST));
  } 

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
      return next(new ErrorResponse('Invalid credentials', NOT_AUTHENTICATED)); 
  }

  // Check if password matches (done in Used modal)
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', NOT_AUTHENTICATED)); 
  }

  sanitizedUser = {
    _id:        user._id,
    firstName:  user.firstName, 
    lastName:   user.lastName, 
    email:      user.email,     
    role:       user.role
  }

  req.session.user = sanitizedUser;

  res.status(OK).json({success: true, data: {}});
});

// @route   GET /api/users/auth/logout
// @desc    Log user out and clear session
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(new ErrorResponse('Problem to destroy session', SERVER_ERROR));
      } else {
          req.session = null;
          res.status(OK).json({success: true, data: {}});
      }
    });
  }
});

// @route   GET /api/users/auth/me
// @desc    Get current logged in user
// @access  Private
exports.getCurrent = asyncHandler(async (req, res, next) => {
  if (req.session && req.session.user) {
    // Retest to be sure that user was not deleted from the database till now. 
    const user = await User.findById(req.session.user._id);
    if (user) {      
      sanitizedUser = {
        _id:        user._id,
        firstName:  user.firstName, 
        lastName:   user.lastName, 
        email:      user.email,     
        role:       user.role
      }
      return res.status(OK).json({success: true, data: sanitizedUser });
    }
  } 
  return next(new ErrorResponse('Not authorized to access this resource', NOT_AUTHENTICATED));   
});