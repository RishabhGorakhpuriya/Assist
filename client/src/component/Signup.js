import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useGlobalContext } from './context/context';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Alert from '@mui/material/Alert';
const Signup = () => {
    const navigate = useNavigate(); // Get the navigate function from useNavigate
    const { credential, SignuphandleChange, SignupHandleSubmit, error, formError,severity } = useGlobalContext();
    const [showpassword, setShowPassword] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await SignupHandleSubmit(e);

        if (result.success) {
            navigate('/login'); // Navigate to home page upon successful signup
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign up for an account
                </h2>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">
                            Full Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={credential.fullName}
                                onChange={SignuphandleChange}
                                required
                                autoComplete="fullName"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {formError.fullName && <p className="text-red-600">{formError.fullName}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email Address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="emailId"
                                type="email"
                                value={credential.emailId}
                                onChange={SignuphandleChange}
                                required
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {formError.emailId && <p className="text-red-600">{formError.emailId}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                        <div className="mt-2">
                            <div className='relative'>
                                <input
                                    id="password"
                                    name="password"
                                    type={showpassword ? "text" : "password"}
                                    value={credential.password}
                                    onChange={SignuphandleChange}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                <div className='absolute top-1 right-4 cursor-pointer' onClick={()=>setShowPassword(!showpassword)}>
                                    {showpassword ? <VisibilityOffOutlinedIcon/> :<VisibilityOutlinedIcon/>} 
                                </div>
                            </div>
                            {formError.password && <p className="text-red-600">{formError.password}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                            Role
                        </label>
                        <div className="mt-2">
                            <select
                                id="role"
                                name="role"
                                value={credential.role}
                                onChange={SignuphandleChange}
                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                            >
                                <option value="" disabled>Select your role</option>
                                <option value="teacher">Teacher</option>
                                <option value="student">Student</option>
                            </select>
                            {formError.role && <p className="text-red-600">{formError.role}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && <Alert severity={severity}>{error}</Alert>}
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already a member?{' '}
                    <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
