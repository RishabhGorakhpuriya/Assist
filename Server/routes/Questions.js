// routes/QuestionRoutes.js
const express = require('express');
const { getAllQuestionsByTopics, addQuestion, uppdateQuestion, deleteQuestion, sendQuestionToAssessment } = require('../controller/Questions');
const {authenticate} = require('../middlware/authenticate');
const router = express.Router();


// Route to get all questions
router.get('/questions/:topic', getAllQuestionsByTopics);
router.post('/addquestions', addQuestion);
router.put('/:id', uppdateQuestion);
router.delete('/:id', deleteQuestion);
router.post('/send-question-to-assessment/:assessmentId',authenticate, sendQuestionToAssessment)
module.exports = router;
