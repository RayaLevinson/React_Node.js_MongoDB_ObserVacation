const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
      trim: true,
      minlength: [2,  'First name should be at least 2 characters'],
      maxlength: [20, 'First name cannot be more than 20 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Please add a last name'],
      trim: true,
      minlength: [2,  'Last name should be at least 2 characters'],      
      maxlength: [20, 'Last name cannot be more than 20 characters']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
        'Please add a valid email' 
      ],
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required:  [true, 'Please add a password'],
      minlength: [6,  'Password should be at least 6 characters'],
      maxlength: [70, 'Password cannot be more than 70 characters'],
      select: false  // API will not return a password
    },
    role: {
      type: String,
      enum: ['user'],   // For admin change manually in database to admin. 
      default: 'user'
    }
  },
  { timestamps: true }
  );

  // Encrypt password using bcrypt
  UserSchema.pre('save', async function(next) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    this.password = await bcrypt.hash(this.password, salt);
  });

  // Match user entered password to hashed password in database
  UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
   
const User = mongoose.model('User', UserSchema);

module.exports = User;
