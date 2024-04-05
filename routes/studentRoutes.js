const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const jwt = require('jsonwebtoken');
const secretKey='12345678';
const Quiz = require('../models/quiz')
const Marks = require('../models/marks')

const authenticateJWT = (req, res, next) => {
  const token = req.header('token');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = user;
    next();
  });
};
// Student Login
router.post('/login', async (req, res) => {
  try {
    const { studentname, password } = req.body;
    const student = await Student.findOne({ studentname });

    if (!student) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    // const isPasswordMatch = await student.comparePassword(password);

    if (password!=student.password) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    // In a real-world scenario, use JWT for authentication and provide a token in the response
    const accessToken = jwt.sign({ id: student.id, studentname: student.studentname}, secretKey);
    res.json({token: accessToken, user:studentname, role:"student" , message:"Login Successful"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/register', async (req, res) => {
  // Assuming you are expecting JSON data in the request body
  const { studentname, password ,role } = req.body;
  try {
    const existingUser = await Student.findOne({ studentname });

    if (existingUser) {
      res.json({ message: 'User already registered' });
    }
    else{
    // Create a new student instance
    const newStudent = new Student({ studentname , password , role});

    // Save the student to the database
    await newStudent.save();

    // Respond with a success message
    res.status(201).json({ message: 'Student registered successfully' });
    }
  } catch (error) {
    // Handle errors, e.g., validation errors or database errors
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/quizzes', authenticateJWT , async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal Server Error' });
  }
});
router.post('/marks',authenticateJWT, async (req, res) => {
  try {

    const { studentname, teachername , title , NOQ , marks   } = req.body;
    const newMark = new Marks({
      teachername,
      studentname,
      marks,
      NOQ,
      title
    });
    const savedMark = await newMark.save();
    res.json(savedMark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/mymarks',authenticateJWT,async (req, res) => {
  try {
    const { id,studentname } = req.user;
    // Use Mongoose to find data based on studentname
    const marksData = await Marks.find({ studentname });

    if (!marksData) {
      return res.status(404).json({ error: 'Marks not found' });
    }

    // Send the marks data as a response
    res.json(marksData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;