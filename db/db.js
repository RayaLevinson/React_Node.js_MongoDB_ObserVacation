const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const { SERVER_ERROR } = require('../constValues/httpStatusCodes');

const db = process.env.MONGODB_URI;

const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  };

  try {
    await mongoose.connect(db, options);
    console.log('MongoDB connected...');
  } catch(err) {
      return next(new ErrorResponse('MongoDB was not connected...', SERVER_ERROR)); 
  }
}

module.exports = connectDB;

