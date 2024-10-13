import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const labels = {
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent',
};

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  const { score, total } = location.state || { score: 0, total: 0 };

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const studentId = localStorage.getItem('id');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedbackData = { assessmentId, studentId, rating, feedback };
    try {
      const response = await axios.post(`http://localhost:4000/api/feedback/${assessmentId}`, feedbackData); // Use the dynamic assessmentId
      console.log('Feedback submitted:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }

  }

  return (
    <div className=" w-full overflow-x-hidden p-3 bg-gray-100">
      <div className="w-full bg-white rounded-lg shadow-lg overflow-y-auto h-[calc(100vh-1.5rem)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 my-8">Assessment Complete</h1>
          <p className="text-2xl text-gray-600 mb-6">
            You scored <span className="font-semibold text-blue-600">{score ?? 'N/A'}</span> out of <span className="font-semibold text-blue-600">{total ?? 'N/A'}</span>.
          </p>
          <form  onSubmit={handleSubmit}>
            <div className="my-4">
              <Rating
                size="large"
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                className="my-2"
              />
              <Box sx={{ ml: 2 }}>{labels[rating]}</Box>
            </div>

            <div className="mx-20 my-10">
              <label htmlFor="description" className="sr-only">Write your Feedback</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your Feedback"
                className="block w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>

            <button
               type="submit" 
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Take the assessment again"
            >
              Go To Home
            </button>
          </form>
        </div>
      </div>
    </div>

  );
};

export default SuccessPage;
