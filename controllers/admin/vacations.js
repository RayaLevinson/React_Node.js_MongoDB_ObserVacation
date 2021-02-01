const path  = require('path');
const io = require('../../socket');
const Vacation = require('../../models/Vacation');
const asyncHandler    = require('../../middleware/async');
const ErrorResponse   = require('../../utils/errorResponse');
const fileHelper = require('../../utils/fileHelper');
const { isVacationExceptImageValid, isImageValid, isVacationIdValid } = require('../../utils/validation/vacationValidation');

const { OK, CREATED, BAD_REQUEST } = require('../../constValues/httpStatusCodes');

//@route    GET /api/vacations
//@desc     Get all vacations
//@access   Private/Admin
exports.getVacations = asyncHandler(async (req, res, next) => {
  const vacations = await Vacation.find();
  res.status(OK).json({ success: true, data: vacations });
});

//@route    POST /api/admin/vacations
//@desc     Add a new vacation
//@route    Private/Admin
/* 
For Vacation creation and update: 
In Postman select body --> form-data ->
Key: title, value: 'My New Vacation'
...
Key: image --> (set type: file). Value: select some file
 */
exports.createVacation  = asyncHandler(async (req, res, next) => {
  const errors = [];
  if (!isVacationExceptImageValid(req.body, errors) || (!isImageValid(req.file, errors))) {
    return next(new ErrorResponse(errors.join(','), BAD_REQUEST));
  }

  const { title, destination, dateFrom, dateTo, price } = req.body;

  const image = req.file;

  const imageURL = '.' + path.sep + image.path;
  
  const newVacation = await Vacation.create({
    title,
    destination,
    imageURL,
    dateFrom, 
    dateTo, 
    price
  });

  // Send a message to all connected clients about new vacation
  io.getIO().emit('vacations', {
    action: 'create',
    vacation: newVacation
  }); 
  res.status(CREATED).json({success: true, data: newVacation});
});

//@route    PUT /api/admin/vacations
//@desc     Update a vacation, Image is not required. If doesn't exist - the old one will be used.
//@route    Private/Admin
exports.updateVacation  = asyncHandler(async (req, res, next) => {
  const errors = [];
  if (!isVacationExceptImageValid(req.body, errors)) {
    return next(new ErrorResponse(errors.join(','), BAD_REQUEST));
  }
  
  const imageInRequest = req.file;

  if (imageInRequest) {
    if (!isImageValid(req.file, errors)) {
      return next(new ErrorResponse(errors.join(','), BAD_REQUEST));
    }
  }
  const id = req.params.id;

  if (!isVacationIdValid(id, errors)) {
    return next(new ErrorResponse(errors.join(','), BAD_REQUEST));
  }

  let vacationSavedInDBPreviously = await Vacation.findById(id);

  if (!vacationSavedInDBPreviously) {
    return next(new ErrorResponse(`Vacation with id ${id} was not found`, BAD_REQUEST));
  }

  const { title, destination, dateFrom, dateTo, price } = req.body;

  const imageURL = imageInRequest ? ('.' + path.sep + imageInRequest.path) : vacationSavedInDBPreviously.imageURL; 
  
  const vacationWithUpdatedFields = {
    title,
    destination,
    imageURL,
    dateFrom, 
    dateTo, 
    price
  }
  const updatedVacation = await Vacation.findByIdAndUpdate(id, 
    { $set: vacationWithUpdatedFields},
    { new: true } // return the modified document
  );
  if (imageInRequest && updatedVacation) {
    fileHelper.deleteFile(vacationSavedInDBPreviously.imageURL);
  }

	// Send a message to all connected clients about updated vacation
	io.getIO().emit('vacations', {
	  action: 'update',
	  vacation: updatedVacation
	});
  res.status(OK).json({success: true, data: updatedVacation});
});


//@route    DELETE /api/admin/vacations/:id
//@desc     Delete a vacation
//@route    Private/Admin
exports.deleteVacation = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const errors = [];

  if (!isVacationIdValid(id, errors)) {
    return next(new ErrorResponse(errors.join(','), BAD_REQUEST));
  }

  const vacation = await Vacation.findById(id);
  if (!vacation) {
    return next(new ErrorResponse(`Vacation with id ${id} was not found`, BAD_REQUEST));
  }
  await Vacation.findByIdAndRemove(id);
  fileHelper.deleteFile(vacation.imageURL);
  
  // Send a message to all connected clients about deleted vacation
  io.getIO().emit('vacations', {
    action: 'delete',
    vacationId: id
  });
  res.status(OK).json({ success: true, data: {} });  
});
