import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Instructions = () => {
    const { assessmentId } = useParams();
    
    const instructions = [
        "This assessment aims to evaluate your knowledge and skills in the relevant subject area.",
        "You will have a specified amount of time to complete the assessment. Keep an eye on the timer displayed on the screen.",
        "The assessment may include multiple-choice questions. Read each question carefully.",
        "You may change your answers at any time before submission. Ensure you confirm any changes you make.",
        "Once you have completed the assessment, click the Submit button. Make sure you have answered all questions you wish to submit.",
        "Monitor your time and pace yourself. It’s recommended to leave a few minutes at the end to review your answers.",
        "If you encounter any technical difficulties, please contact your instructor or the support team immediately.",
        "If you switch tabs during the assessment, you will receive a warning. If you switch tabs again, the assessment will be submitted automatically."
    ];

    return (
        <div className="w-full flex flex-row h-screen">
            <div className="w-full p-4 bg-white rounded-lg shadow-lg flex flex-col m-3 overflow-y-auto h-[calc(100vh-1.5rem)]">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-5">Important Instructions</h2>
                <ol className='space-y-4 p-10'  style={{ listStyleType: 'decimal' }}>
                    {instructions.map((instruction, index) => (
                        <li key={index} className='text-gl text-start'>{instruction}</li>
                    ))}
                </ol>
                <div className="flex justify-center">
                    <Link to={`/userAssessment/${assessmentId}`}>
                        <button className='bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-800'>Start</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Instructions;
