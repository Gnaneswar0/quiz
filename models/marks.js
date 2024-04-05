const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  studentname: String,
  teachername: String,
  title: String,
  NOQ:Number,
  marks: Number,
  createdAt: {
    type: Date,
    default: Date.now
}
});


const Marks = mongoose.model('Marks', marksSchema);

module.exports = Marks;
