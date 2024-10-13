import React, { useState, useEffect, Suspense, lazy,startTransition } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Tabsgroup from './Tabsgroup';
import { Alert } from '@mui/material';
const  Loading = lazy(()=>import('./Loading')) ;

const Modal = ({ isOpen, onClose, selectedStudent, onUpdate }) => {

    const [score, setScore] = useState(selectedStudent.score || 0);
    const [feedback, setFeedback] = useState(selectedStudent.feedback || '');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const { id } = useParams();
    const nevigate = useNavigate();
    useEffect(() => {
        setScore(selectedStudent?.score || 0);
        setFeedback(selectedStudent?.feedback || '');
    }, [selectedStudent]);

    const handleSend = async () => {
        setSending(true);
        setLoading(true);
        setError('');
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

            // Convert score to number
            const scoreNumber = Number(score);

            // Ensure score is valid
            if (isNaN(scoreNumber)) {
                throw new Error('Invalid score');
            }

            const response = await axios.put(`http://localhost:4000/api/updateResult/${selectedStudent.id}`, { score: scoreNumber, feedback }, config);

            console.log('Assessment updated:', response.data);
            onUpdate(selectedStudent.id, scoreNumber, feedback);
            setSuccess('Assessment Updated successfully!');
            setError(null);
            setTimeout(()=>{
                setSuccess('');
                onClose(); // Close the modal on success
                nevigate(`/studentfeedback/${id}`)
            },3000)
           
        } catch (err) {
            setError('Error updating assessment. Please try again.');
            console.error('Error sending assessments:', err);
            setTimeout(()=>{
                setError('');
            },3000);
        } finally {
            setSending(false);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6  max-w-4xl h-auto max-h-[80vh] overflow-y-auto flex flex-col">
                <p className="text-xl  text-gray-600 mb-2">Student Name: {selectedStudent ? selectedStudent.studentId.fullName : ""}</p>
                <p className="text-xl text-gray-600 mb-2">Email: {selectedStudent ? selectedStudent.studentId.emailId : ""}</p>
                <p className="text-xl text-gray-600 ">Assessment Name: {selectedStudent ? selectedStudent.assessmentId.title : ""}</p>

                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <div className="mt-6">
                    <label htmlFor="score" className="block text-sm font-semibold text-gray-700 mb-2">
                        Score:
                    </label>
                    <input
                        type="number"
                        id="score"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        placeholder="Enter score"
                    />
                </div>

                <div className="mt-6">
                    <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700 mb-2">
                        Feedback:
                    </label>
                    <textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Enter feedback"
                        rows="4"
                    ></textarea>
                </div>

                {error && <p className="text-red-500 mt-4">{error}</p>}

                <div className="flex justify-between mt-auto">
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-sm text-white px-2 py-1 rounded-lg hover:bg-red-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={sending}
                        className="bg-green-500 text-white text-sm px-2 py-1 rounded-lg hover:bg-green-600"
                    >
                        {sending ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
};



const StudentFeedback = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const { id } = useParams();
    useEffect(() => {
        const fetchStudents = async () => {
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

                // Replace with your API endpoint
                const response = await axios.get(`http://localhost:4000/api/getAssessment/${id}`, config);
                startTransition(()=>{
                    setStudents(response.data);
                })
                console.log(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [id]);


    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
        // setStudents(student)
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdateStudent = (studentId, newScore, newFeedback) => {
        setStudents((prevStudents) => {
            return prevStudents.map((student) => {
                if (student.id === studentId) {
                    return { ...student, score: newScore, feedback: newFeedback };
                }
                return student;
            });
        });
    };

    return (
        <div className="w-full flex flex-row h-screen">
            <div className="w-full p-4 bg-white rounded-lg shadow-lg flex flex-col m-5 overflow-y-auto h-[calc(100vh-2.5rem)]">
                <h1 className="text-xl font-bold mb-2">Student Assessments</h1>

                {error && <p className="text-red-500 mb-4">Error: {error}</p>}

                <div className="space-y-4">
                    <Suspense fallback={<Loading />}>
                        {loading ? (<Loading />) : (students.length === 0 ? (
                            <p>No students found.</p>
                        ) : (
                            <Tabsgroup students={students} handleOpenModal={handleOpenModal} />
                        ))}

                    </Suspense>
                    {selectedStudent && (
                        <Modal
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            selectedStudent={selectedStudent}
                            onUpdate={handleUpdateStudent}
                        />
                    )}

                </div>
            </div>
        </div>
    );
};

export default StudentFeedback;
