const {
  FIRST_NAME_MIN_LENGTH,
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MIN_LENGTH,
  LAST_NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  EMAIL_REGEX
} = require ('./constants');

const isRegistrationInputValid = (inputValues, errors) => {
  let { firstName, lastName, email, password, confirmPassword, role } = inputValues;

  if (isEmaiAndPasswordValid(email, password, errors)) {
    // --> All fields are required
    if (!firstName) {
      errors.push(' Please add a first name');
    }
    if (!lastName) {
      errors.push(' Please add a last name');
    }
    if (!confirmPassword) {
      errors.push(' Please add a password confirmation');
    }
    // <-- All fields are required
    if (errors.length > 0) {
      return false;
    }

    if (password !== confirmPassword) {
      errors.push(' Password and password confirmation are not match');
    }

    if (errors.length > 0) {
      return false;
    }

    // --> Trim values
    firstName = firstName.trim();
    lastName = lastName.trim();
    // <-- Trim values

    // --> Length of the fields
    if ((firstName.length < FIRST_NAME_MIN_LENGTH) || (firstName.length > FIRST_NAME_MAX_LENGTH)) {
      errors.push(` First name should be at least ${FIRST_NAME_MIN_LENGTH} and not more than ${FIRST_NAME_MAX_LENGTH} characters`);
    }

    if ((lastName.length < LAST_NAME_MIN_LENGTH) || (lastName.length > LAST_NAME_MAX_LENGTH)) {
      errors.push(` Last name should be at least ${LAST_NAME_MIN_LENGTH} and not more than ${LAST_NAME_MAX_LENGTH} characters`);
    }
    // <-- Length of the fields
    
    if (role) {
      if (role !== 'user') {
        errors.push(" Please enter a valid role. Possible value is 'user'");
      }
    }
  }
  if (errors.length > 0) {
    return false;
  }

  return true;
}

const isLoginInputValid = (inputValues, errors) => {
  const { email, password } = inputValues;

  if (isEmaiAndPasswordValid(email, password, errors)) {
    return true;
  }
  return false;  
}

const isEmaiAndPasswordValid = (email, password, errors) => {
  if (!email) {
    errors.push(' Please add an email');
  }

  if (!password) {
    errors.push(' Please add a password');
  }

  if (errors.length > 0) {
    return false;
  }

  email = email.trim();
  if (!EMAIL_REGEX.test(email)) {
    errors.push(' Please enter a valid email');
  }

  if ((password.length < PASSWORD_MIN_LENGTH) || (password.length > PASSWORD_MAX_LENGTH)) {
    errors.push(` Password should be at least ${PASSWORD_MIN_LENGTH} and not more than ${PASSWORD_MAX_LENGTH} characters`);
  }

  if (errors.length > 0) {
    return false;
  }
  
  return true;
}

module.exports = {
  isRegistrationInputValid,
  isLoginInputValid
}