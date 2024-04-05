const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  question:String,
  options:[String],
  correct:String
});

const quizSchema = new mongoose.Schema({
  teachername : String,
  title : String,
  NOQ : Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  questions : [questionSchema]
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;