const mongoose = require('mongoose');

const VacationSchema = mongoose.Schema({
    title: {
      type: String, 
      required:   [true, 'Please add a vacation title'],
      trim: true,
      minlength:  [2,  'Vacation title should be at least 2 characters'],
      maxlength:  [40, 'Vacation title cannot be more than 40 characters']
    },
    destination: {
      type: String, 
      required:   [true, 'Please add a vacation destination'],
      trim: true,
      minlength:  [2,  'Vacation destination should be at least 2 characters'],
      maxlength:  [40, 'Vacation destination cannot be more than 40 characters']
    },
    imageURL: {
      type: String,
      required: [true, 'Please add vacation image URL'],
    },
    dateFrom: {
      type: Number,
      required: [true, 'Please add vacation start date'],
    },
    dateTo: {
      type: Number,
      required: [true, 'Please add vacation end date'],
    },
    price: {
      type: Number, 
      required: [true, 'Please add vacation price'],
      min:      [0, 'Price must be at least 0'],
    },    
    followers: [{
      type: mongoose.Schema.Types.ObjectId,      
      ref: 'users' // reference to the collection in database
    }],    
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vacation', VacationSchema);