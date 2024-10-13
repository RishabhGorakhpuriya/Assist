import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import Alert from '@mui/material/Alert';
const optionsList = [
  { id: 1, name: "General Knowledge" },
  { id: 2, name: "Mathematics" },
  { id: 3, name: "Science" },
  { id: 4, name: "Technology" },
  { id: 5, name: "English" },
  { id: 6, name: "Arts" },
  { id: 7, name: "Business and Economics" },
  { id: 8, name: "Biology" },
  { id: 9, name: "Chemistry" },
  { id: 10, name: "Physics" },
  { id: 11, name: "Coding" }
];

const AddQuestionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']); // 4 options
  const [answer, setAnswer] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [topic, setTopic] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [alertseverity, setAlertSeverity] = useState('success');
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const assessmentQuestionData = {
        question,
        options,
        answer,
        questionType,
        topic,
        isActive,
        createdBy: 'user_id_here', // Replace with actual user ID
        assessment: id
      };

      const response = await axios.post(`http://localhost:4000/api/assessmentQuestion/addQuestionInAssessment`, assessmentQuestionData, config);
      console.log('Question added:', response.data);

      // alert("Question Added Successfully");
      setAlertSeverity("Question Added Successfully")
      navigate(`/assessment/${id}`); // Navigate upon successful addition
      setTimeout(()=>{
        setAlertSeverity("");
      }, 3000)
    } catch (error) {
      console.error('Error adding question:', error);
      setAlertSeverity("Failed to add question")
      setError(error.response?.data?.message || 'Failed to add question');
      setTimeout(()=>{
        setAlertSeverity('');
      })
    }
  };

  return (
    <div className="w-full flex flex-row h-screen">
      <div className="w-full p-3 bg-white rounded-lg shadow-lg flex flex-col m-3 overflow-y-auto h-[calc(100vh-1.5rem)]">
        <h2 className="text-2xl font-semibold mb-2">Add New Question</h2>
        {error &&  <Alert severity={alertseverity}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="question" className="block text-sm text-gray-800 mb-2">Question</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">Options</label>
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full text-sm mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Option ${index + 1}`}
                required
              />
            ))}
          </div>
          <div className="mb-4">
            <label htmlFor="answer" className="block text-sm text-gray-700 mb-2">Answer</label>
            <input
              id="answer"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Correct Answer"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="questionType" className="block text-sm text-gray-700 mb-2">Question Type</label>
            <select
              id="questionType"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MCQ">MCQ</option>
              <option value="True/False">True/False</option>
              <option value="Short Answer">Short Answer</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="topic" className="block text-sm text-gray-700 mb-2">Topic</label>
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Topic</option>
              {optionsList.map(option => (
                <option key={option.id} value={option.name}>{option.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="form-checkbox text-blue-500"
              />
              <span className="ml-2 text-gray-700 text-sm">Active</span>
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-sm text-white px-3 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionForm;
