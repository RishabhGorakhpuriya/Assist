const Assessment = require('../models/Assessments');
const Question = require('../models/Questions');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// Teacher only

exports.createAssessment = async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token and extract user ID
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            userId = decoded.id;
            console.log(userId, decoded)
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const { title, description, dueDate } = req.body;

        if (!title || !description || !dueDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new assessment with the user ID from the token
        const newAssessment = new Assessment({ title, description, dueDate, createdBy: userId });
        const savedAssessment = await newAssessment.save();

        // Fetch default questions
        const questions = await Question.find();

        // Return the saved assessment and default questions
        // res.status(201).json(savedAssessment);
        res.status(201).json({
            assessment: savedAssessment,
            questions: questions
        });
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
};




exports.updateAssessment = async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'Please authenticate.' });
        }

        // Verify token and extract user ID
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            userId = decoded.id;
            console.log('Token verified, userId:', userId);
        } catch (err) {
            console.log('Invalid token', err);
            return res.status(401).json({ message: 'Invalid token.' });
        }

        // Fetch the assessment to check if it exists and if the user is the creator
        console.log(req.params)
        const assessment = await Assessment.findById(req.params.id);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found.' });
        }

        // Check if the user is the creator of the assessment
        if (assessment.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to update this assessment.' });
        }

        // Update the assessment
        const updatedAssessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAssessment) {
            return res.status(404).json({ message: 'Assessment not found.' });
        }

        res.status(200).json(updatedAssessment);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.getAssessment = async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'Please authenticate.' });
        }

        // Verify token and extract user ID
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            userId = decoded.id;
            console.log('Token verified, userId:', userId);
        } catch (err) {
            console.log('Invalid token', err);
            return res.status(401).json({ message: 'Invalid token.' });
        }

        // Fetch the assessment to check if it exists and if the user is the creator
        console.log(req.params)
        const assessment = await Assessment.findById(req.params.id);
        if (!assessment) {
            return res.status(200).json({ message: 'Assessment not found.' });
        }
        res.status(200).json(assessment);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.getAssessmentByIds = async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'Please authenticate.' });
        }

        // Verify token and extract user ID
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            userId = decoded.id;
            console.log('Token verified, userId:', userId);
        } catch (err) {
            console.log('Invalid token', err);
            return res.status(401).json({ message: 'Invalid token.' });
        }

        let assessmentIds = req.body.assessments;


         // Check if assessmentIds is an array
        if (!Array.isArray(assessmentIds) || assessmentIds.length === 0) {
            return res.status(400).json({ message: 'Invalid or missing assessments array' });
        }

        // Fetch the assessment to check if it exists and if the user is the creator
        const assessments = await Assessment.find({ '_id': { $in: assessmentIds } })
        if (!assessments) {
            return res.status(200).json({ message: 'Assessment not found.' });
        }
        res.status(200).json(assessments);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getAssessmentsByCreator = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token and extract user ID
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }


        const assessments = await Assessment.find({ createdBy: userId });

        if (assessments.length === 0) {
            return res.status(404).json({ message: 'No assessments found for this creator' });
        }

        res.status(200).json(assessments);
    } catch (err) {
        console.error('Error retrieving assessments:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getQuestionsByAssessmentId = async (req, res) => {
    try {
      // Get the assessment ID from the request parameters
      const { id } = req.params;
      console.log('Assessment ID:', id);
  
      // Validate the assessment ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid assessment ID' });
      }
  
      // Find questions by assessment ID
      const questions = await Question.find({ assessment: id });
  
      // Check if questions are found
      if (questions.length === 0) {
        return res.status(200).json({ message: 'No questions found for this assessment' });
      }
  
      // Respond with the list of questions
      res.status(200).json(questions);
    } catch (err) {
      console.error('Error retrieving questions:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  
  exports.deleteAssessmentById = async (req, res) => {
      const { id } = req.body; // Ensure you're sending the ID in the request body
      try {
          const token = req.headers.authorization?.split(' ')[1];
          if (!token) {
              return res.status(401).json({ message: 'No token provided' });
          }
  
          let userId;
          try {
              const decoded = jwt.verify(token, process.env.SECRET_KEY);
              userId = decoded.id;
          } catch (error) {
              return res.status(401).json({ message: 'Invalid token' });
          }
  
          // Use findByIdAndDelete directly with the ID
          const deleteAssessment = await Assessment.findByIdAndDelete(id);
          if (deleteAssessment) {
              return res.status(200).json({ message: 'Assessment deleted successfully' });
          } else {
              return res.status(404).json({ message: 'No assessment found for the provided ID' });
          }
      } catch (err) {
          console.error('Error in deletion:', err); // Log the error for debugging
          return res.status(500).json({ message: 'Server error', error: err.message });
      }
  };
  