import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
const AssessmentUpdate = () => {
  const { id } = useParams(); // Get assessment ID from URL
  const navigate = useNavigate(); // Hook to navigate programmatically

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', severity: '' });
  useEffect(() => {
    const fetchAssessmentData = async () => {
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

        const response = await axios.get(`http://localhost:4000/api/assessment/get/${id}`, config);
        const { title, description, dueDate, isActive } = response.data;
        setTitle(title);
        setDescription(description);
        setDueDate(dueDate);
        setIsActive(isActive);
      } catch (error) {
        console.error('Error fetching assessment data:', error);
        setError('Failed to fetch assessment data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [id]);

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

      const response = await axios.put(`http://localhost:4000/api/assessment/updateAssessment/${id}`, {
        title,
        description,
        dueDate,
        isActive,
      }, config);

      setAlert({ message: 'Assessment updated successfully!', severity: 'success' });
      setTimeout(() => {
        setAlert({ message: '', severity: '' });
      },3000)
      // Redirect to the assessments list or another appropriate route
    } catch (error) {
      setAlert({ message: 'Failed to Update assessment !', severity: 'success' });
      setTimeout(() => {
        setAlert({ message: '', severity: '' });
      }, 3000)
    }
  };


  if (error) return <div className="text-red-600 mb-4">{error}</div>;

  return (
    <div className="w-full flex flex-row h-screen">
 
      <div className="w-full p-4 bg-white rounded-lg shadow-lg flex flex-col m-3 overflow-y-auto h-[calc(100vh-1.5rem)]">
        <form onSubmit={handleSubmit} className="">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-gray-900 my-2">Update Assessment</h2>
            {alert.message && <Alert severity={alert.severity}>{alert.message}</Alert>}
            {loading ? (<div className="flex justify-center items-center h-full">
              <h2 className="text-lg text-gray-500">Loading user profile...</h2>
            </div>) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-gl font-semibold leading-8 text-gray-900 ">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Assessment Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="block w-full  rounded-lg border-gray-300 focus:ring-indigo-600 focus:border-indigo-600 "
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-gl font-semibold leading-8 text-gray-900">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    placeholder="Assessment Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="block w-full rounded-lg border-gray-300 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-gl font-semibold leading-8 text-gray-900">
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="block w-full  rounded-lg border-gray-300 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>

                <div className="flex items-center space-x-4 mt-6">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                    className="text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                  />
                  <label htmlFor="isActive" className="text-gl font-semibold text-gray-900">
                    Active
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-8 mt-12">
            <button
              type="button"
              className="text-lg font-semibold leading-6 text-gray-900"
              onClick={() => navigate('/')} // Adjust the path as needed
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-2 py-1 text-lg font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentUpdate;
