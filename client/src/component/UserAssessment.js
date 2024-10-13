import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const Assessment = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [startassessment, setStartAssessment] = useState([]);
  const totalPages = startassessment.length;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [counter, setCounter] = useState(20);
  const [tabChnage, setTabChnage] = useState(0);


  // console.log("assesmentId", id);
  useEffect(() => {
    const startAssessmentApi = async () => {
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
        setStartAssessment(response.data);
        const totalQuestion = response.data.length;
        setCounter(totalQuestion * 60);
        console.log(response.data);
        setAnswers(Array(totalQuestion).fill(''));

      } catch (error) {
        console.error('Error fetching assessment or questions:', error);
      }
    };
    startAssessmentApi();
  }, [id])


  const handleChange = (e, index) => {
    setAnswers(prev => ({
      ...prev,
      [index]: e.target.value
    }));
  };
  const studentAssessmentIdsString = localStorage.getItem('studentAssessmentIds');
  const studentAssessmentIds = studentAssessmentIdsString ? JSON.parse(studentAssessmentIdsString) : {};

  // Make sure `id` is correctly defined and used
  const studentAssId = studentAssessmentIds[id] || null;
  console.log("studentAssId", studentAssId);


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("assessment submit");
    let score = 0;
    let total = 0;

    startassessment.length > 0 && startassessment.forEach((q, index) => {
      if (answers[index] && answers[index].trim() === q.answer.trim()) {
        score += 1;
      }
    });

    total = startassessment.length;
    console.log("total question", total);

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

      // Assuming you want to send the score to the server
      if (studentAssId) {
        const response = await axios.put(`http://localhost:4000/api/updateResult/${studentAssId}`, { score, total }, config);
        console.log(response.data);

        // Navigate after successful submission
        navigate(`/SubmitSuccessfull/${id}`, { state: { score, total } });
      } else {
        console.error('Student assessment ID not found.');
      }

    } catch (error) {
      console.error('Error updating result:', error);
    }
  };


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentQuestionIndex = currentPage - 1;
  const currentQuestion = startassessment[currentQuestionIndex];

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setInterval(() => {
        setCounter(prev => prev - 1);
      }, 1000);

    } else {
      handleSubmit(new Event('submit'));
    }
    return () => clearInterval(timer);
  }, [counter]);


  useEffect(()=>{
    const handleVisibilityChange = ()=>{
      if(document.hidden){
        setTabChnage(prev =>prev +1);
        if(tabChnage === 0){
          alert("Warning: Switching tabs during the test is not allowed!. You do this again test will submit automatically");
        }else if(tabChnage === 1){
          handleSubmit(new Event('submit'));
        }
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tabChnage])

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;
  return (
    <div className="w-full flex min-h-screen bg-gray-100">
      {/* Sidebar with all questions */}
      <div className="bg-gray-200 p-5 border-r border-gray-300 overflow-y-auto">
        <h2 className="text-gl font-bold mb-4">Questions</h2>
        <div className="grid grid-cols-4 gap-2">
          {Array.isArray(startassessment) && startassessment.map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${answers[index] ? 'bg-green-500' : (currentQuestionIndex === index ? 'bg-purple-500' : 'bg-gray-300')}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="w-3/4 p-8 mx-10">
        <div className='flex d-flex justify-between '>
          <h1 className="text-2xl font-bold mb-6">Assessment</h1>
          <h1 className="text-2xl font-bold mb-6">Time Remaining: {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {currentQuestion && (
            <div className="p-4">
              <p className="text-xl font-semibold mb-1">{currentPage}. {currentQuestion.question}</p>
              {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option, i) => (
                <label key={i} className="block mr-5  text-sm">
                  <input
                    type="radio"
                    name={`question${currentPage}`}
                    value={option}
                    checked={answers[currentQuestionIndex] === option}
                    onChange={(e) => handleChange(e, currentQuestionIndex)}
                    className="mr-2  my-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center  mt-10">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                className="px-2 py-1 border rounded bg-blue-500 text-white  hover:bg-blue-600"
              >
                Previous
              </button>
              <span className="px-2 py-1 border rounded ">{currentPage} / {totalPages}</span>
              <button
                type="button"
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                className="px-2 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Next
              </button>
            </div>
            {currentPage === totalPages && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
              >
                Submit Answers
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Assessment;
