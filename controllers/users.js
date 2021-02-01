const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse   = require('../utils/errorResponse');
const {
  isRegistrationInputValid
} = require ('../utils/validation/userValidation');
const {
  OK,
  CREATED,
  BAD_REQUEST
} = require('../constValues/httpStatusCodes');

//@route    GET /api/users
//@desc     Get users
//@acceess  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(OK).json({ success: true, data: users });
});

//@route    POST /api/users
//@desc     Create a new user
//@acceess  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Validate input
  const errors = [];
  if (! isRegistrationInputValid(req.body, errors)) {
    return next(new ErrorResponse(errors.join(','), BAD_REQUEST));
  } 

  let user = await User.findOne({ email });
  if (user) { 
    return next(new ErrorResponse('Email was already registered.', BAD_REQUEST));
  }

  // Encyption of the password is done in the User Modal middleware
  user = await User.create({
    firstName, 
    lastName, 
    email, 
    password,
    role
  });
  
  sanitizedUser = {
    _id:        user._id,
    firstName:  user.firstName, 
    lastName:   user.lastName, 
    email:      user.email,     
    role:       user.role
  }
  
  req.session.user = sanitizedUser;
  
  res.status(CREATED).json({success: true, data: {}});
});


