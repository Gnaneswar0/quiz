const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teachername: String,
  password: String,
  role:String
});


const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;