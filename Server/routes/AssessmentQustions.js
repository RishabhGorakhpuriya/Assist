const express = require('express');
const {authenticate, authorize} = require('../middlware/authenticate');
const { addQuestiontoAssessment, getQuestionsByAssessmentId, updateAssessmentQuestion, deleteAssessmentQuestion} = require('../controller/AssessmentQustions');
const router = express.Router();

router.get('/getQuestionByAssessmentId/:id', authenticate, authorize(['teacher', 'student']), getQuestionsByAssessmentId);

router.post('/addQuestionInAssessment', authenticate, authorize(['teacher']),  addQuestiontoAssessment);

router.put('/updateAssessmentQuestion/:id', authenticate, authorize(['teacher']), updateAssessmentQuestion);

router.delete('/deleteAssessmentQuestion', authenticate, authorize(['teacher']), deleteAssessmentQuestion)

module.exports = router;
