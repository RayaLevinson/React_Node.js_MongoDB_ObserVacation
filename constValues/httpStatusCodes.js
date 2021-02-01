const OK = 200;
const CREATED = 201;  // Success and resource was created
const BAD_REQUEST = 400;  // Bad Request
const NOT_AUTHENTICATED = 401;  // Not Authenticated
const FORBIDDEN = 403   // Forbidden - server understood the request but refuses to authorize it.
const NOT_FOUND = 404;  // Not Found
const UNPROCESSABLE_ENTITY = 422;  // Validation failed
const SERVER_ERROR = 500;  // Internal server error

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_AUTHENTICATED,
  FORBIDDEN,
  NOT_FOUND,
  UNPROCESSABLE_ENTITY,
  SERVER_ERROR
}

