import React, { Suspense, useEffect, useState, lazy } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SideBar from './SideBar';
import Checkbox from '@mui/material/Checkbox';
import { Alert } from '@mui/material';
const Loading = lazy(() => import('./Loading'));

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Modal = ({ isOpen, onClose, selectedQuestions }) => {
    const [assessment, setAssessment] = useState([]);
    const [selectAssessment, setSelectedAssessments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    useEffect(() => {
        const fetchAssessments = async () => {
            setLoading(true);
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
                setAssessment(response.data);
            } catch (err) {
                console.error('Error fetching question:', err);
                setError('Failed to fetch question.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    const handleCheckboxChange = (id) => {
        // Update to select only one assessment
        setSelectedAssessments(prevSelected => (prevSelected === id ? null : id));
    };


    const handleSend = async () => {
        if (selectedQuestions.length === 0) {
            setError('No questions selected.');
            return;
        }

        if (!selectAssessment) {
            setError('No assessment selected.');
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
                    'Content-Type': 'application/json',
                },
            };


            const payload = { id: selectedQuestions };

            console.log('Payload to be sent:', payload);
            const response = await axios.post(`http://localhost:4000/api/send-question-to-assessment/${selectAssessment}`, payload, config);
            console.log('Successfully assigned question:', response.data);
            setSuccess('Question send successfully to Assessment!');
            setError(null);
            setTimeout(() => {
                setSuccess('');
            }, 3000)
        } catch (err) {
            setError('Failed to send Question to Assessment. Please try again.');
            console.error('Error assigning question:', err.response ? err.response.data : err.message);
            setTimeout(() => {
                setError('');
            }, 3000);
            setSuccess(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed p-10 inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white  p-5 rounded-lg shadow-lg w-full max-w-4xl h-auto max-h-[80vh] overflow-y-auto flex flex-col">
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                {sending && <Alert security='info'>Sending question...</Alert>}

                <Suspense fallback={<Loading />}>
                    {loading ? (<Loading />) : (assessment.length > 0 ? (
                        <ul className="list-disc pl-5 my-4">
                            {Array.isArray(assessment) && assessment.map((assess) => (
                                <li key={assess.id} className="mb-2 flex items-center">
                                    <Checkbox
                                        {...label}
                                        className="mr-2 text-4xl"
                                        checked={selectAssessment === assess.id}
                                        onChange={() => handleCheckboxChange(assess.id)}
                                    />
                                    <div className="mx-3 text-gl mt-3">
                                        <h3 className="font-bold">{assess.title}</h3>
                                        {assess.description} (Due: {new Date(assess.dueDate).toLocaleDateString()})
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No question found.</p>
                    ))}

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


const QuestionDetail = () => {
    const { topic } = useParams();
    // const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        const fetchAssessmentData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/api/questions/${topic}`);
                setQuestions(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching assessment or questions:', error);
                setError('Failed to fetch assessment details or questions.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssessmentData();
    }, [topic]);



    const handleCheckboxChange = (id) => {
        setSelectedQuestions(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(questionId => questionId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleOpenModal = () => {
        if (selectedQuestions.length === 0) {
            alert("Please select at least one question.");
            return;
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="w-full flex flex-row overflow-hidden">
            {/* <aside className="w-50">
                <SideBar />
            </aside> */}
            <Suspense fallback={<Loading />}>
                <div className="w-full p-4 bg-white rounded-lg shadow-lg flex flex-col m-3 overflow-y-auto h-[calc(100vh-1.5rem)]">
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className='h-full'>
                            <div className="flex justify-end gap-4 mb-4">
                                <button
                                    // onClick={handleDeleteQuestion}
                                    onClick={handleOpenModal}
                                    disabled={selectedQuestions.length === 0}
                                    className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                                >
                                    Send
                                </button>
                            </div>
                            {questions.length > 0 ? (
                                <ul className="list-disc pl-5 my-10">
                                    {Array.isArray(questions) && questions.map((question, index) => (
                                        <li key={question.id} className="m-8 flex items-start">
                                            <Checkbox
                                                className='mr-4'
                                                {...label}
                                                checked={selectedQuestions.includes(question.id)}
                                                onChange={() => handleCheckboxChange(question.id)}
                                            />
                                            <span className="text-lg">{index + 1}.</span>
                                            <div className="ml-2">
                                                <span className="text-lg">{question.question}</span>
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
                    <Modal isOpen={isModalOpen}
                        onClose={handleCloseModal} selectedQuestions={selectedQuestions} />
                </div>
            </Suspense>
        </div>
    );
}

export default QuestionDetail;
