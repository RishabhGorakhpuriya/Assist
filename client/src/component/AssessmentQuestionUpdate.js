import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import Loading from './Loading';

const AssessmentQuestionUpdate = () => {
  const { id } = useParams(); // Assuming `id` is the question ID for editing
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Initialize with at least two options
  const [answer, setAnswer] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [topic, setTopic] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionData = async () => {
      setLoading(true);
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

        const response = await axios.get(`http://localhost:4000/api/questions/${id}`, config);
        const data = response.data;
        setQuestion(data.question);
        setOptions(data.options || []);
        setAnswer(data.answer);
        setQuestionType(data.questionType || 'MCQ');
        setTopic(data.topic || '');
        setIsActive(data.isActive ?? true);
      } catch (error) {
        console.error('Error fetching question data:', error);
        setError('Failed to fetch question data.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionData();
  }, [id]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const updatedQuestion = {
        question,
        options,
        answer,
        questionType,
        topic,
        isActive,
      };

      await axios.put(`http://localhost:4000/api/questions/${id}`, updatedQuestion, config);
      navigate(`/assessmentDetails/${id}`); // Redirect after update
    } catch (error) {
      console.error('Error updating question:', error);
      setError('Failed to update question.');
    }
  };

 

  return (
    <div className="w-full flex flex-row h-screen">
      <div className="w-full p-4 bg-white rounded-lg shadow-lg flex flex-col m-3 overflow-y-auto h-[calc(100vh-1.5rem)]">
        <h2 className="text-3xl font-semibold mb-4">Update Question</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Suspense fallback={<Loading />}>
          {loading ? (<Loading />) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="question" className="block text-gray-800 mb-2">Question</label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Options</label>
                {Array.isArray(options) && options.map((option, index) => (
                  <div key={index} className="relative mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="absolute right-0 top-0 mt-2 mr-2 text-red-500"
                      >
                        &#x2715;
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Add Option
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor="answer" className="block text-gray-700 mb-2">Answer</label>
                <input
                  id="answer"
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Correct Answer"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="questionType" className="block text-gray-700 mb-2">Question Type</label>
                <select
                  id="questionType"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MCQ">MCQ</option>
                  <option value="True/False">True/False</option>
                  <option value="Short Answer">Short Answer</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="topic" className="block text-gray-700 mb-2">Topic</label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Topic"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="form-checkbox text-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Question
              </button>
            </form>)}
        </Suspense>
      </div>
    </div>
  );
};

export default AssessmentQuestionUpdate;
