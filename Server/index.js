const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToMongo = require('./db');
const authRouter = require('./routes/Auth'); // Ensure this path is correct
const questionRouter = require('./routes/Questions');
const assessmentRouter = require('./routes/AssessmentRoutes');
const studentAssessmentRouter = require('./routes/StudentAssessment');
const assessmentQuestionRouter = require('./routes/AssessmentQustions');
const UsersFeedbackRouter = require('./routes/UserFeedback');
// const userListRouter = require('./routes/Auth');
// const assignAssessmentRouter = require('./routes/AssignAssessment');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your frontend to access the API
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Authorization', 'Content-Type'], // Allowed headers
}));

dotenv.config();

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectToMongo();

// Middleware
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs")
app.use(express.urlencoded({extended:false}))
// Use the router middleware
app.use('/auth', authRouter);
app.use('/api', questionRouter);
app.use('/api/assessment', assessmentRouter);
app.use('/api', studentAssessmentRouter)
app.use('/api/assessmentQuestion', assessmentQuestionRouter);
app.use('/api', UsersFeedbackRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
