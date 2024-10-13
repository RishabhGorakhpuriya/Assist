import React, { useEffect, useState, Suspense, lazy, startTransition } from 'react';
import axios from 'axios';
import SideBar from './SideBar';
import { Link } from 'react-router-dom';
import { Alert } from '@mui/material';
const Loading = lazy(() => import('./Loading'))


// Modal Component
const Modal = ({ isOpen, onClose, user }) => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300); // Match this duration with your exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!user) return;
    const fetchAssessments = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        const response = await axios.get('http://localhost:4000/api/assessment', config);
        startTransition(() => {
          setAssessments(response.data);
        });
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError('Failed to fetch assessments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [user]);

  const handleCheckboxChange = (id) => {
    setSelectedAssessments((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((assessmentId) => assessmentId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSend = async () => {
    if (selectedAssessments.length === 0) {
      setSendError('No assessments selected.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(`http://localhost:4000/api/studentAssessment/${user.id}`, // Ensure user.id is the studentId
        selectedAssessments.map((id) => ({ assessmentId: id })),
        config
      );
      startTransition(()=>{
        console.log('Successfully assigned assessments:', response.data);
        setSuccess('Assessment send successfully!');
        setError(null);
      })
      setTimeout(() => {
        setSuccess('');
        onClose(); // Close the modal on successful assignment
      }, 3000)

    } catch (err) {
      setError('Failed to create assessment. Please try again.');
      setTimeout(() => {
        setError('');
      }, 3000);
      setSuccess(null);
    } finally {
      setSending(false);
    }
  };

  // if (!isOpen) return null;
  if (!visible) return null;

  return (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white p-5 rounded-lg shadow-lg w-full max-w-4xl h-auto max-h-[80vh] overflow-y-auto flex flex-col transition-transform duration-300 ${isOpen ? 'transform scale-100' : 'transform scale-95'}`}>
        {user ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800">{user.fullName}</h2>
            <p className="text-xl text-gray-600 mb-2">{user.emailId}</p>
            <p className="text-gray-400 text-sm">Created on: {new Date(user.createdAt).toLocaleDateString()}</p>
          </>
        ) : (
          <Loading />
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        {sending && <Alert security='info'>Sending assessments...</Alert>}
        {sendError && <Alert security='error'>Error Occure</Alert>}
        <Suspense fallback={<Loading />}>
          {loading ? (
            <Loading />
          ) : (
            assessments.length > 0 ? (
              <ul className="list-disc pl-5 my-4">
                {Array.isArray(assessments) && assessments.map((assessment) => (
                  <li key={assessment.id} className="mb-2 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedAssessments.includes(assessment.id)}
                      onChange={() => handleCheckboxChange(assessment.id)}
                      className="mr-2 text-4xl"
                    />
                    <div className="mx-3 text-gl mt-3">
                      {assessment.assessmentId && assessment.assessmentId.title ? ( // Check if assessmentId and title exist
                        <>
                          <h3 className="font-bold">{assessment.assessmentId.title || ''}</h3>
                          <p>{assessment.assessmentId.description || 'No description available.'}</p>
                          <p>(Due: {new Date(assessment.assessmentId.dueDate).toLocaleDateString()})</p>
                        </>
                      ) : (
                        <span className="text-red-500">Assessment information not available</span> // Fallback message
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No assessments found.</p>
            )
          )}
        </Suspense>
        <div className="flex justify-between mt-auto">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};


// UserCard Component
const UserCard = ({ user, onOpenModal }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-5 m-2 max-w-sm w-full">
      <h2 className="text-gl font-semibold text-gray-800">{user.fullName}</h2>
      <p className="text-sm text-gray-600">{user.emailId}</p>
      <p className="text-sm text-gray-400 text-sm">Created on: {new Date(user.createdAt).toLocaleDateString()}</p>
      <button
        onClick={() => onOpenModal(user)}
        style={{ zIndex: 11, position: 'relative' }}
        className="bg-blue-500 text-sm text-white px-2  py-2 mt-4 rounded-lg hover:bg-blue-600 mr-4 mr-4 z-1">
        Send Assessment
      </button>

      <Link to={`/studentfeedback/${user.id}`}>
        <button
          className="bg-blue-500 text-sm text-white px-2  py-2 mt-4 rounded-lg hover:bg-blue-600"
        >
          View Details
        </button>
      </Link>
    </div>
  );
};

// UserListPage Component
const UserListPage = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usererror, setUserError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  useEffect(() => {
    const getUserList = async () => {
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

        const response = await axios.get('http://localhost:4000/auth/userList', config);
        startTransition(() => {
          setUsers(response.data);
          setFilteredAssessments(response.data);
        })

      } catch (err) {
        console.error('Error fetching users:', err);
        setUserError('Failed to fetch users.');

      } finally {
        setLoading(false);
      }
    };

    getUserList();
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (Array.isArray(users) && users.length > 0) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = users.filter(user => {
        const fullName = user.fullName ? user.fullName.toLowerCase() : '';
        const emailId = user.emailId ? user.emailId.toLowerCase() : '';
        return fullName.includes(searchLower) || emailId.includes(searchLower);
      });
      setFilteredAssessments(filtered);
    } else {
      setFilteredAssessments(users); // Reset to all users if the search term is empty or users is not an array
    }
  }, [searchTerm, users]);

  return (
    <div className="w-full flex flex-row h-screen">
      <div className="w-full p-4 bg-white rounded-lg shadow-lg flex flex-col m-3 overflow-y-auto h-[calc(100vh-1.5rem)]">
        <div className="mb-6 flex items-center space-x-4">
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
            className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
            Clear
          </button>
        </div>
        <h1 className="text-xl font-bold ml-5 mb-4">Student List </h1>

        <Suspense fallback={<Loading />}>
          {loading ? (<Loading />) : (<div className="flex flex-wrap">
            {Array.isArray(filteredAssessments) && filteredAssessments.length > 0 ? (
              filteredAssessments.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onOpenModal={handleOpenModal}
                />
              ))
            ) : (
              <p className='text-2xl ml-5'>No users found.</p>
            )}
          </div>)}
        </Suspense>
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      </div>
    </div>
  );
};

export default UserListPage;
