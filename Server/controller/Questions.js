// controller/Questions.js
// const Assessment = require('../models/Assessments');
const Question = require('../models/Questions');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const AssessmentsQuestions = require('../models/AssessmentQustions')
const Assessment = require('../models/Assessments');


exports.getAllQuestionsByTopics = async (req, res) => {
    const { topic } = req.params;
    try {
        const questions = await Question.find({ topic });
        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this topic' });
        }
        res.status(200).json(questions);
    } catch (err) {
        // Ensure only one response is sent
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
};


exports.addQuestion = async (req, res) => {
    try {
        // Extract and validate fields from request body
        const { question, options, answer, questionType, topic } = req.body;
        if (!question || !options || !answer || !questionType || !topic) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Extract token from headers
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

        // Create a new question
        const newQuestion = new Question({
            question,
            options,
            answer,
            questionType,
            topic,
            createdBy: userId // Use the user ID from the token
            // assessment
        });

        // Save the question to the database
        const savedQuestion = await newQuestion.save();

        // Respond with the saved question
        res.status(201).json(savedQuestion);
    } catch (err) {
        console.error('Error adding question:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.uppdateQuestion = async (req, res) => {
    try {
        if (!question || !options || !answer || !questionType) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Extract token from headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const id = req.params.id;
        const { question, options, answer, questionType, createdBy } = req.body;
        if (!question && !options && !answer && !questionType && !createdBy) {
            return res.status(400).json({ message: 'At least one field is required to update' });
        }
        // Find and update the question
        const updatedQuestion = await Question.findByIdAndUpdate(id, {
            $set: { question, options, answer, questionType, createdBy }
        }, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Respond with the updated question
        res.status(200).json(updatedQuestion);

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

exports.deleteQuestion = async (req, res) => {
    try {
        const id = req.params.id; // Retrieve the question ID from the request parameters

        // Delete the question from the database
        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.sendQuestionToAssessment = async(req, res)=>{
    try{
        const {id} = req.body
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        if (!id || !Array.isArray(id) || id.length === 0) {
            return res.status(400).json({ message: 'Invalid or missing IDs' }); // Use res.status for 400 response
        }
        const questions = await Question.find({_id : {$in : id}})
        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for the provided IDs' });
        }

        const assessmentId = req.params.assessmentId;
        const assessment = await Assessment.findById(assessmentId);

        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        const newAssessmentQuestions = questions.map(question => ({
            question: question.question,
            options: question.options,
            answer: question.answer,
            questionType: question.questionType,
            createdBy: req.user._id, // Assuming you have user info in req.user
            assessment: assessmentId
        }));

        await AssessmentsQuestions.insertMany(newAssessmentQuestions);

        return res.status(200).json({ message: 'Questions added to assessment successfully', assessmentId });
    }catch(error){
        res.status(400).json({ message: 'Failed', error });
    }   
}