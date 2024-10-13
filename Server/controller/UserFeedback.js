const express = require('express');
const UsersFeedback = require('../models/UserFeedback')

exports.UserGiveFeeback= async(req, res)=>{
    try{
        const {assessmentId} = req.params;
        const {studentId, feedback, rating } = req.body;
        const newFeedback = new UsersFeedback({ assessmentId, studentId, feedback, rating });
        await newFeedback.save();
        res.status(201).json(newFeedback);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}