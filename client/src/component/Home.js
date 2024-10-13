import React, { useEffect, Suspense, lazy } from 'react';
import SideBar from './SideBar';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGlobalContext } from './context/context';
import axios from 'axios';
const Loading = lazy(() => import('./Loading'));


// Component for displaying an individual assessment
const AssessmentCard = ({ assessment }) => (

  (
    <>
      <Link
        to={`/assessment/${assessment.id}`}
        className="bg-white shadow-lg rounded-lg p-2 transition-transform transform hover:scale-105 hover:shadow-xl mt-10">
      <Link to={`/updateAssessment/${assessment.id}`}>
        <Box className="float-right" sx={{ '& > :not(style)': { m: 1 } }}>
          <Fab size="small" color="secondary" aria-label="edit">
            <EditIcon className='float-right' size={10} />
          </Fab>
        </Box>
      </Link>
      {/* <Box className="float-right" sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab size="small" color="primary" aria-label="edit">
          <DeleteIcon className='float-right' size={10} onClick={(e) => { e.stopPropagation(); handleDeleteAssessment(assessment.id) }} />
        </Fab>
      </Box> */}

        <h3 className="text-gl font-semibold mb-4 text-center">{assessment.title}</h3>
        <p className="text-sm text-gray-700 mb-4 text-center">{assessment.description}</p>
        <p className="text-sm text-gray-500 text-center">Due Date: {new Date(assessment.dueDate).toLocaleDateString()}</p>
      </Link>
    </>
  )
);



// Component for displaying an individual assessment for students
const AssessmentCard2 = ({ assessment }) => {
  const status = assessment.attempted;
  return (
    <>
      {status ? (
        <div className="bg-gray-200 shadow-lg rounded-lg p-2 mt-5">
          <span class="inline-flex items-center rounded-md bg-green-50 mb-2 px-2 py-1 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-600/20">Completed</span>
          <h3 className="text-lg font-semibold mb-4 text-center">{assessment.assessmentId.title}</h3>
          <p className="text-sm text-gray-700 mb-4 text-center">{assessment.assessmentId.description}</p>
          <p className="text-sm text-gray-500 mb-2 text-center">Due Date: {new Date(assessment.assessmentId.dueDate).toLocaleDateString()}</p>
        </div>
      ) : (<Link
        to={`/instruction/${assessment.assessmentId.id}`}
        className="bg-white shadow-lg rounded-lg p-2 mb-2 transition-transform transform hover:scale-105 hover:shadow-xl mt-5">
        <span class="inline-flex items-center rounded-md mb-2 bg-green-50 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-600/20">Not Completed</span>
        <h3 className="text-gl font-semibold mb-4 text-center">{assessment.assessmentId.title}</h3>
        <p className="text-gl text-gray-700 mb-4 text-center">{assessment.assessmentId.description}</p>
        <p className="text-sm text-gray-500 mb-2 text-center">Due Date: {new Date(assessment.assessmentId.dueDate).toLocaleDateString()}</p>
      </Link>)}
    </>
  );
};

const Home = () => {
  const { assessments, setFilteredAssessments, searchTerm, setSearchTerm, UserRole, filteredAssessments, loading } = useGlobalContext();

  useEffect(() => {
    // Filter assessments based on search term
    if (Array.isArray(assessments)) {
      setFilteredAssessments(
        assessments.filter((assessment) =>
          (assessment.title ? assessment.title.toLowerCase() : '').includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, assessments]);

  const handleDeleteAssessment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Ensure the content type is set
        },
      };

      const response = await axios.delete('http://localhost:4000/api/assessment/deleteAssessmentById', {
        data: { id }, // Send the ID in the request body
        ...config,
      });

      console.log('Assessment deleted:', response.data);
      // Optionally refresh the assessments state after deletion
      setFilteredAssessments((prev) => prev.filter((assessment) => assessment.id !== id));
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  return (
    <div className="w-full flex flex-row h-screen">
      <div className="w-full p-4 bg-white rounded-lg shadow-lg flex flex-col m-3 overflow-y-auto h-[calc(100vh-1.5rem)]">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              className="w-full  pl-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a7 7 0 014.743 12.743l4.577 4.576a1 1 0 001.414-1.414l-4.577-4.576A7 7 0 1111 4z"></path>
              </svg>
            </span>
          </div>
          <button
            onClick={() => setSearchTerm('')}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
            Clear
          </button>
        </div>
        <div>
          <Suspense fallback={<Loading />}>
            {loading ? (
              <Loading />
            ) : (
              <>
                {filteredAssessments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredAssessments.map((assessment) => (
                      UserRole === 'teacher' ? (
                        <AssessmentCard key={assessment.id} assessment={assessment} handleDeleteAssessment={handleDeleteAssessment} />
                      ) : (
                        <AssessmentCard2 key={assessment.id} assessment={assessment} />
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-3xl text-center text-gray-500 mt-4">No assessments available</p>
                )}
              </>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Home;
