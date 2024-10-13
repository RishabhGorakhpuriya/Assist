import React, { useState, useEffect, Suspense, startTransition } from 'react';
import axios from 'axios';
import Loading from '../Loading';

const AssessmentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchAssessmentHistory = async () => {
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

        const response = await axios.get(`http://localhost:4000/api/getAssessment/${id}`, config);
        startTransition(() => {
          setHistory(response.data);
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching assessment history:', err);
        setError(err.response?.data?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentHistory();
  }, [id]);

  const fullName = localStorage.getItem('fullName');
  const emailId = localStorage.getItem('emailId');

  if (error) return <p className="text-red-500">{error}</p>;

  const attemptedHistories = history.filter(histories => histories.attempted === true);

  return (
    <div className="w-full flex flex-row h-screen">
      <div className="w-full p-4 bg-white rounded-lg shadow-lg flex flex-col m-2 overflow-y-auto h-[calc(100vh-1.2rem)]">
        <h1 className="text-2xl text-center font-bold mb-2">Assessment History</h1>
        <div className="space-y-4">
          <Suspense fallback={<Loading />}>
            {loading ? (
              <Loading />
            ) : (
              attemptedHistories.length > 0 ? (
                attemptedHistories.map(histories => (
                  <div key={histories._id} className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-2">Student Name: {fullName}</h2>
                    <h2 className="text-lg font-semibold mb-2">Email: {emailId}</h2>
                    <h2 className='ml-4 font-small text-lg'>Date: {new Date(histories.createdAt).toLocaleDateString()}</h2>
                    <span className="mt-5">
                      {histories.assessmentId ? (
                        <>
                          <span className="ml-4 font-small text-lg">Assessment Title: {histories.assessmentId.title || 'N/A'}</span>
                          <span className="ml-4 font-small text-lg">Score: {histories.score}/{histories.total || 0}</span>
                          <span className="ml-4 font-small text-lg">Feedback: {histories.feedback || 'No feedback'}</span>
                        </>
                      ) : (
                        <span className="ml-4 font-small text-lg">Assessment information not available</span>
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-full">
                  <h2 className="text-lg text-gray-500">No assessment history found</h2>
                </div>
              )
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AssessmentHistory;
