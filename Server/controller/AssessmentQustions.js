const express = require('express');
const AssessmentsQuestions = require('../models/AssessmentQustions')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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
        const questions = await AssessmentsQuestions.find({ assessment: id });

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


exports.addQuestiontoAssessment = async (req, res) => {
    try {
        // Extract and validate fields from request body
        const { question, options, answer, questionType, assessment } = req.body;
        if (!question || !options || !answer || !questionType || !assessment) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate assessment ID and createdBy ID
        if (!mongoose.Types.ObjectId.isValid(assessment)) {
            return res.status(400).json({ message: 'Invalid assessment ID' });
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
        const newQuestion = new AssessmentsQuestions({
            question,
            options,
            answer,
            questionType,
            createdBy: userId, // Use the user ID from the token
            assessment
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

exports.updateAssessmentQuestion = async (req, res) => {
    try {
        const id = req.params.id;
        const { question, options, answer, questionType, createdBy } = req.body;

        if (!question && !options && !answer && !questionType && createdBy === undefined) {
            return res.status(400).json({ message: 'At least one field is required to update' });
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const updatedQuestion = await AssessmentsQuestions.findByIdAndUpdate(id, {
            $set: { question, options, answer, questionType, createdBy }
        }, { new: true });

        if (!updatedQuestion) {
            return res.status(200).json({ message: 'Question not found' });
        }

        res.status(200).json(updatedQuestion);

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.deleteAssessmentQuestion = async (req, res) => {
    try {
        const { id } = req.body; // Retrieve the question IDs from the request body

        // Optionally, validate the token if required for authorization
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Validate the incoming IDs
        if (!id || !Array.isArray(id) || id.length === 0) {
            return res.status(400).json({ message: 'Invalid or missing IDs' }); // Use res.status for 400 response
        }

        // Delete the questions from the database
        const deletedQuestion = await AssessmentsQuestions.deleteMany({ _id: { $in: id } });

        if (deletedQuestion.deletedCount  > 0) {
            // Respond with a success message
            return res.status(200).json({ message: 'Questions deleted successfully', deletedCount: deletedQuestion.deletedCount });
        } else {
            return res.status(404).json({ message: 'No questions found for the provided IDs' });
        }

    } catch (err) {
        // Handle server errors
        console.error('Error in deletion:', err); // Log the error for debugging
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};
