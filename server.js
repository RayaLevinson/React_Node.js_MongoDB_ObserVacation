require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const socket = require('./socket');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoSanitize = require('express-mongo-sanitize');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('./db/db');
const authRoute = require('./routes/auth');
const vacationsForUsersRoute = require('./routes/users/vacations');
const usersRoute = require('./routes/users');
const adminVacationsRoute = require('./routes/admin/vacations');
const errorHandler = require('./middleware/error');
const ErrorResponse = require('./utils/errorResponse');
const { isImageValid } = require('./utils/validation/imageValidation');
const { BAD_REQUEST } = require('./constValues/httpStatusCodes');
const { MAX_FILE_UPLOAD_SIZE_IN_BYTES } = require('./utils/validation/constants');

const WEEK = 1000 * 60 * 60 * 24 * 7;
const UPLOADS_DIR = '.' + path.sep + process.env.UPLOADS_FOLDER;
const baseUrl = process.env.BASE_URL || '';

const app = express();

const mongoDbStore = MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'mySessions',
  expires: WEEK
});

// Body Parser Middleware 
app.use(express.json({ extended: false }));

// Control where uploaded images will be stored.
const fileStorage = multer.diskStorage({  
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR)  // UPLOADS_DIR is a target folder for images on the server
  },
  filename: (req, file, cb) => {
    // Create custom file name
    cb(null, `${uuidv4()}-${file.originalname}`)
  }
});

const fileFilter = (req, file, cb) => {
  const errors = [];
  if (isImageValid(file, errors)) {
    cb(null, true); // first param is an error, true => save file
  } else {
      return cb(new ErrorResponse(`${errors.join('')}`, BAD_REQUEST), false);
    }
}

app.use(multer({ 
  storage: fileStorage,
  fileFilter,
  limits: {fileSize: MAX_FILE_UPLOAD_SIZE_IN_BYTES}
}).single('image'));

// Connect to database
connectDB();

// The session ID is stored inside of the cookie. The cookie then gets sent with every request to our server and our session middleware uses the ID from the cookie to find the user's session/data.
app.use(session({
  name:     process.env.SESS_NAME,
  secret:   process.env.SESS_SECRET,
  resave:   false,
  saveUninitialized: false,
  store:    mongoDbStore,   // Add persistent Session storage to application so that restarting server doesn't log all users out.
  cookie: { 
    secure:   false,
    maxAge:   WEEK,
    httpOnly: true,
    path:     `${baseUrl}/`
  },
}));

// Sanitize user-supplied data to prevent MongoDB Operator Injection.
app.use(mongoSanitize());

// Routes
app.use(`${baseUrl}/api/users`, usersRoute);
app.use(`${baseUrl}/api/users/auth`, authRoute);
app.use(`${baseUrl}/api/vacations`, vacationsForUsersRoute);
app.use(`${baseUrl}/api/admin/vacations`, adminVacationsRoute);

// Middleware that catches errors - should be at the end (just before) get('/')
app.use(errorHandler);

// Set static folder
app.use(`${baseUrl}/${process.env.UPLOADS_FOLDER}`, express.static(path.join(__dirname, process.env.UPLOADS_FOLDER)));
// Serve static assets in production == serve React in production
if (process.env.NODE_ENV === 'production') {
  app.use(`${baseUrl}/`, express.static(path.join(__dirname, 'client', 'build')));

  app.get(`${baseUrl}/*`, (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);  

  socket.init(server, {path: `${baseUrl}/socket.io`});
  socket.getIO().on('connection', socket => {
    console.log('Client connected');
  })
});
