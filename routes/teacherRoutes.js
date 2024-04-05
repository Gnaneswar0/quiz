const express = require('express');
const router = express.Router();
const Teacher= require('../models/teacher'); 
const Quiz =require('../models/quiz')
const Marks = require('../models/marks')
const jwt = require('jsonwebtoken');
const secretKey='12345678';

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
// Teacher Login
router.post('/login', async (req, res) => {
  try {
    const { teachername, password } = req.body;
    const teacher = await Teacher.findOne({ teachername });
     
    if (!teacher) {
      return res.status(401).json({message:'Invalid login credentials'});
    }
     
    if (password!=teacher.password) {
      return res.status(401).json({message:'Invalid password'});
    }
    const accessToken = jwt.sign({ id: teacher.id, teachername: teacher.teachername}, secretKey);
    res.json({token: accessToken, user:teacher.teachername, role:teacher.role, message:"Login Successful"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Internal Server Error'});
  }
});

// Add Question
router.post('/addQuiz', authenticateJWT ,async (req, res) => {
  try {
   const {title,NOQ,questions}=req.body;
  console.log(req.body)
    const newQuiz = new Quiz({teachername:req.user.teachername,title,NOQ,questions});
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// View Marks
router.get('/viewmarks', async (req, res) => {
  try {
    res.status(200).json({ message: 'Viewing student marks' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/quizzes',authenticateJWT ,async (req, res) => {
  try {
    const teachername = req.user.teachername;
    const quizzes = await Quiz.find({ teachername });
    console.log(quizzes)
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  // Assuming you are expecting JSON data in the request body
  const { teachername, password , role} = req.body;
  // Perform validation
  try {
    const existingUser = await Teacher.findOne({ teachername });

    if (existingUser) {
      res.json({ message: 'User already registered' });
    }
    else{
    // Create a new student instance
    const newTeacher = new Teacher({ teachername , password, role});
    // Save the student to the database
    await newTeacher.save();

    // Respond with a success message
    res.status(201).json({ message: 'Teacher registered successfully'});
    }
  } catch (error) {
    // Handle errors, e.g., validation errors or database errors
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.get('/myquizzes',authenticateJWT,async (req, res) => {
  try {
    const { id,teachername } = req.user;
    // Use Mongoose to find data based on studentname
    const marksData = await Marks.find({ teachername });

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