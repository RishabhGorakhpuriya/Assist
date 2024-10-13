import React, { useEffect, useState, Suspense, lazy, startTransition } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { pink } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
const Loading = lazy(() => import('./Loading'));


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const AssessmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [alert, setAlert] = useState({ message: '', severity: '' });
  useEffect(() => {
    const fetchAssessmentData = async () => {
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

        const response = await axios.get(`http://localhost:4000/api/assessmentQuestion/getQuestionByAssessmentId/${id}`, config);
        startTransition(() => {
          setQuestions(response.data);
        })

      } catch (error) {
        console.error('Error fetching assessment or questions:', error);
        setError('Failed to fetch assessment details or questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [id]);

  const handleDeleteQuestion = async () => {
    if (selectedQuestions.length === 0) {
      setError('No questions selected for deletion.');
      return;
    }

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

      const response = await axios.delete('http://localhost:4000/api/assessmentQuestion/deleteAssessmentQuestion', {
        headers: config.headers,
        data: { id: selectedQuestions },
      });

      // Update the state to remove the deleted questions
      setQuestions(prevQuestions => prevQuestions.filter(question => !selectedQuestions.includes(question.id)));
      setSelectedQuestions([]); // Clear selected questions
      setAlert({ message: 'Questions deleted successfully!', severity: 'success' });
      setTimeout(() => {
        setAlert({ message: '', severity: '' }); // Clear the alert
      }, 3000);
    } catch (error) {
      console.error('Error in deletion', error);
      setError('Failed to delete the selected questions. Please try again.');
      setAlert({ message: 'Failed to delete the selected questions. Please try again.', severity: 'error' }); // Set alert
      setTimeout(() => {
        setAlert({ message: '', severity: '' }); // Clear the alert
      }, 3000);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedQuestions(prevSelected => {
      if (prevSelected.includes(id)) {
        // If the ID is already selected, remove it
        return prevSelected.filter(questionId => questionId !== id);
      } else {
        // If the ID is not selected, add it
        return [...prevSelected, id];
      }
    });
  };

  return (
    <div className="w-full flex flex-row overflow-hidden">
      <div className="w-full p-4 bg-white rounded-lg shadow-lg flex flex-col m-3 overflow-y-auto h-[calc(100vh-1.5rem)]">
      {alert.message && <Alert severity={alert.severity}>{alert.message}</Alert>}
        <Suspense fallback={<Loading />}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
             <Loading/>
            </div>
          ) : (
            <div className='h-full'>
              <div className="flex justify-end gap-4 absolute right-10">
                <Box className="" sx={{ '& > :not(style)': { m: 1 } }}>
                  <Fab
                    size='small'
                    color="secondary"
                    aria-label="delete"
                    onClick={handleDeleteQuestion}
                    disabled={selectedQuestions.length === 0}
                  >
                    <DeleteIcon />
                  </Fab>
                  <Fab size='small' color="primary" aria-label="add">
                    <AddIcon onClick={() => navigate(`/addNewQuestion/${id}`)} />
                  </Fab>
                </Box>
              </div>
              {questions.length > 0 ? (
                <ul className="list-disc pl-5 my-10 relative">
                  {questions.map((question, index) => (
                    <li key={question._id} className="m-8 flex items-star t">
                      <div>

                        <Checkbox className='p-5' {...label} sx={{
                          color: pink[800],
                          '&.Mui-checked': {
                            color: pink[600],
                          },
                        }} checked={selectedQuestions.includes(question.id)} // This correctly checks if the specific question is selected
                          onChange={() => handleCheckboxChange(question.id)} />

                      </div>

                      <span className="text-gl">{index + 1}</span>
                      <div>
                        <span className="text-gl">. {question.question}</span>
                        <ul className="list-disc text-sm pl-4">
                          {question.options.map((option, index) => (
                            <li key={index}>{option}</li>
                          ))}
                        </ul>
                        <p className="text-yellow-700">Answer: {question.answer}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='flex justify-center items-center h-full'>
                  <h1 className='text-2xl'>No questions found for this assessment. Please add questions.</h1>
                </div>

              )}
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default AssessmentDetails;
