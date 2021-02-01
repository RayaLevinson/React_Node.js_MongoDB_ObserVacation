const {
  VACATION_TITLE_MIN_LENGTH,
  VACATION_TITLE_MAX_LENGTH,
  VACATION_DESTINATION_MIN_LENGTH,
  VACATION_DESTINATION_MAX_LENGTH
} = require ('./constants');

const isVacationExceptImageValid = (inputValues, errors) => {
  let { title, destination, price, dateFrom, dateTo } = inputValues;
  // --> All fields are required
  if (!title) {
    errors.push(' Please add a title');
  }

  if (!destination) {
    errors.push(' Please add a destination');
  }

  if (!price) {
    errors.push(' Please add a price');
  }

  if (!dateFrom) {
    errors.push(' Please add a vacation start date');
  }

  if (!dateTo) {
    errors.push(' Please add a vacation end date');
  }  
  // <-- All fields are required
  if (errors.length > 0) {
    return false;
  }  

  if ((isNaN(Number(dateFrom)) || (isNaN(Number(dateTo))))) {
    errors.push(` Please insert a valid departing and returning dates.`);
  }
  if (errors.length > 0) {
    return false;
  }

  // --> Trim values
  title = title.trim();
  destination = destination.trim();
  // <-- Trim values

  // --> Length of the fields
  if ((title.length < VACATION_TITLE_MIN_LENGTH) || (title.length > VACATION_TITLE_MAX_LENGTH)) {
    errors.push(` Title should be at least ${VACATION_TITLE_MIN_LENGTH} and not more than ${VACATION_TITLE_MAX_LENGTH} characters`);
  }

  if ((destination.length < VACATION_DESTINATION_MIN_LENGTH) || (destination.length > VACATION_DESTINATION_MAX_LENGTH)) {
    errors.push(` Destination should be at least ${VACATION_DESTINATION_MIN_LENGTH} and not more than ${VACATION_DESTINATION_MAX_LENGTH} characters`);
  }
  // <-- Length of the fields

  if (isNaN(Number(price))) {
    errors.push(` Please insert a valid price`);
  }

  // --> Check dates
  if (dateFrom > dateTo) {
    errors.push(` Returning data should be bigger than departing date`);
  }
  
   // Used when my server is located in a different country
  let today = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jerusalem"})).setHours(0, 0, 0, 0);

  if (dateFrom < today) {
    errors.push(` Please insert a valid departing date.`);
  }
  if (dateTo < today) {
    errors.push(` Please insert a valid returning date.`);
  } 
  // <-- Check dates
  if (errors.length > 0) {
    return false;
  }

  return true;
}

const isVacationIdValid = (vacationId, errors) => {
  if (!vacationId) {
    errors.push('Vacation id is missing.');
    return false;
  }
  return true;
}

const isImageValid = (image, errors) => {
  // Image is required  
  if (!image) {
    errors.push(' Please add an image!');
    return false;
  }
  return true; 
}

module.exports = {
  isVacationExceptImageValid,
  isImageValid,
  isVacationIdValid
}