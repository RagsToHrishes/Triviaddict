//libraries imported
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Making a schema for each user object in my database
//Each user will have a username, password, strengths, preferences plus a property to record how many correct answers
//and how many times they logged in.

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  strengths: {
    type: Object,
  },
  prefs: {
    type: Object
  }
}, {
  timestamps: true,
});

//Assing this schema to a variable which I can refer to
//This makes it so that I can use mongoDB functions based on this schema
const User = mongoose.model('User', userSchema);

module.exports = User;