import axios from 'axios';
import { useState } from 'react';
import SideBar from './SideBar';
import Alert from '@mui/material/Alert';
function AssessmentForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Replace with your actual API URL
            const response = await axios.post('http://localhost:4000/api/assessment/createAssessment', {
                title,
                description,
                dueDate,
                isActive
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
                }
            });

            console.log(response.data); // Handle the response data as needed
            setSuccess('Assessment created successfully!');
            setError(null);
            setTimeout(()=>{
                setSuccess('');
            },3000)
        } catch (err) {
            console.error(err);
            setError('Failed to create assessment. Please try again.');
            setTimeout(()=>{
                setError('');
            },3000);
            setSuccess(null);
        }
    };

    return (
        <div className="w-full flex flex-row h-screen">
            <div className="w-full p-5 bg-white rounded-lg shadow-lg flex flex-col m-3 overflow-y-auto h-[calc(100vh-1.5rem)]">
                <form onSubmit={handleSubmit} className=''>
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-gray-900 mb-4">Create Assessment</h2>
                        <p className="text-lg leading-8 text-gray-600">
                            Please fill out the form to create a new assessment. Ensure all required fields are completed.
                        </p>

                        {/* Error and Success Messages */}
                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <div className="space-y-2">
                            <div>
                                <label htmlFor="title" className="block text-gl font-semibold leading-8 text-gray-900">
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
                                    className="block w-full rounded-lg border-gray-300 focus:ring-indigo-600 focus:border-indigo-600"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-gl font-semibold leading-8 text-gray-900s">
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
                                    className="block w-full mt-2 rounded-lg border-gray-300 focus:ring-indigo-600 focus:border-indigo-600"
                                />
                            </div>

                            {/* Uncomment and implement this if needed */}
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
                                    className="block w-full mt-2 rounded-lg border-gray-300 focus:ring-indigo-600 focus:border-indigo-600"
                                />
                            </div>

                            <div className="flex items-center space-x-2 mt-2">
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
                    </div>

                    <div className="flex justify-end space-x-8">
                        <button
                            type="button"
                            className="text-sm font-semibold leading-6 text-gray-900"
                            onClick={() => { /* Handle cancel logic */ }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-4 py-1 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AssessmentForm;
