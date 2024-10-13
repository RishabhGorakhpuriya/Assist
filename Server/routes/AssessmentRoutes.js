const express = require('express');
const { createAssessment, updateAssessment, getAssessmentsByCreator, getAssessment, getAssessmentByIds, deleteAssessmentById} = require('../controller/Assessments');
const {getQuestionsByAssessmentId} = require('../controller/Assessments')
const {authenticate, authorize} = require('../middlware/authenticate')
const router = express.Router();

// Create an assessment (Teacher only)
router.post('/createAssessment', authenticate, authorize(['teacher']), createAssessment);

// get an assessment (Teacher only)
router.get('/get/:id', authenticate, authorize(['teacher']), getAssessment);

router.post('/getByIds/', authenticate, authorize(['student']), getAssessmentByIds);

// Get assessments (Students can view, Teachers can also use this to manage)
router.get('/', authenticate, authorize(['teacher']), getAssessmentsByCreator);

router.get('/getQuestionByAssessmentId/:id', authenticate, authorize(['teacher', 'student']), getQuestionsByAssessmentId)


router.put('/updateAssessment/:id', authenticate, authorize(['teacher']), updateAssessment);

router.delete('/deleteAssessmentById', authenticate, authorize(['teacher']), deleteAssessmentById)

module.exports = router;
