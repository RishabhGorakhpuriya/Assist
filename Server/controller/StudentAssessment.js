const expresss = require('express');
const StudentAssessment = require('../models/StudentsAssessments');
const jwt = require('jsonwebtoken');


exports.AssessmentWithStudent = async (req, res) => {
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
      console.log(userId, decoded);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Extract studentId from req.params
    const studentId = req.params.id;
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required.' });
    }

    // Extract assessments from req.body
    const assessments = req.body;
    if (!Array.isArray(assessments) || assessments.length === 0 || !assessments.every(a => a.assessmentId)) {
      return res.status(400).json({ message: 'Assessment IDs must be provided as an array of objects with assessmentId.' });
    }

    // Create multiple records for each assessment
    const assessmentRecords = assessments.map(a => ({
      assessmentId: a.assessmentId,
      studentId,
      createdAt: new Date() // or use a default value if your schema provides one
    }));


    // Check if the records already exist before inserting
   

    console.log(assessmentRecords)

    // Insert the records into the database
    try {
      // Check if the records already exist before inserting
      const existingRecords = await StudentAssessment.find({
        studentId,
        assessmentId: { $in: assessments.map(a => a.assessmentId) }
      }).lean();

      const existingAssessmentIds = existingRecords.map(record => record.assessmentId.toString());

      const newRecords = assessmentRecords.filter(record => !existingAssessmentIds.includes(record.assessmentId.toString()));

      if (newRecords.length > 0) {
        const result = await StudentAssessment.insertMany(newRecords);
        return res.status(201).json(result);
      } else {
        return res.status(200).json({ message: 'No new assessments to add.' });
      }
    } catch (dbError) {
      return res.status(500).json({ message: 'Database error', error: dbError.message });
    }

  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
};




exports.getStudentAssessment = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      userId = decoded.id;
      console.log(userId, decoded);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const studentId = req.params.id;
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required.' });
    }

    // Find the student assessment by studentId
    const assessment = await StudentAssessment.find({ studentId }).populate({
      path: 'assessmentId', // Field to populate
      select: 'title description dueDate createdBy', // Fields to select from the populated document
      model: 'Assessment' // The model to populate from
    }).populate({ path: 'studentId', select: 'fullName emailId role', model: 'User' })
      .exec();
    if (!assessment) {
      return res.status(200).json({ message: 'No assessment found for the given student ID.' });
    }

    // Respond with the found assessment
    res.status(200).json(assessment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.updateStudentResult = async (req, res) => {
  try {
    const id = req.params.id; // The ID of the student assessment to update
    const { assessmentId, studentId, feedback, score, total, attempted } = req.body; // The fields to update
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token and extract user ID
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      userId = decoded.id;
      console.log(userId, decoded);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: 'Student Assessment ID is required.' });
    }

    // Find and update the StudentAssessment document
    const updatedStudentAssessment = await StudentAssessment.findByIdAndUpdate(
      id,
      { assessmentId, studentId, feedback, score, total, attempted: true },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedStudentAssessment) {
      return res.status(404).json({ message: 'Student Assessment not found' });
    }

    return res.status(200).json(updatedStudentAssessment);

  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
};
