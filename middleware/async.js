
// Helps do not have try-catch around every async action.
const asyncHandler = fn => (req, res, next) => {
  Promise
    .resolve(fn(req, res, next))
    .catch(next)
}

module.exports = asyncHandler;