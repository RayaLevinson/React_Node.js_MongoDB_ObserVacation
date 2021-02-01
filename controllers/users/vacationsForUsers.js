const Vacation = require('../../models/Vacation');
const User = require('../../models/User');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

const { OK, BAD_REQUEST} = require('../../constValues/httpStatusCodes');

//@route    GET /api/vacations
//@desc     Get all vacations
//@access   Private/User
exports.getVacations = asyncHandler(async (req, res, next) => {
  const vacations = await Vacation.find();
  res.status(OK).json({ success: true, data: vacations });
});

//@route    PATCH /api/vacations/like/:id
//@desc     Update a vacation - add a follower
//@route    Private/User
exports.addLike  = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  let vacation = await Vacation.findById(id);
  if (!vacation) {
    return next(new ErrorResponse(`Vacation with id ${id} was not found`, BAD_REQUEST));
  }
  
  const { followerId } = req.body;

  const user = await User.findById(followerId);
  if (!user) {
    return next(new ErrorResponse(`User with id ${followerId} was not found`, BAD_REQUEST));
  }
  
  vacation = await Vacation.findByIdAndUpdate(id, 
    { $addToSet: {followers: followerId} },
    { new: true }) // return the modified document

  res.status(OK).json({success: true, data: vacation});
});

//@route    PATCH /api/vacations/unlike/:id
//@desc     Update a vacation - remove a follower
//@route    Private/User
exports.removeLike  = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  let vacation = await Vacation.findById(id);
  if (!vacation) {
    return next(new ErrorResponse(`Vacation with id ${id} was not found`, BAD_REQUEST));
  }
  
  const { followerId } = req.body;

  const user = await User.findById(followerId);
  if (!user) {
    return next(new ErrorResponse(`User with id ${followerId} was not found`, BAD_REQUEST));
  }
  
  vacation = await Vacation.findByIdAndUpdate(id, 
    { $pull: {followers: followerId} },
    { new: true }) // return the modified document

  res.status(OK).json({success: true, data: vacation});
});
