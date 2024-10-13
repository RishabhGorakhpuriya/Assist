import React, { useState, useEffect, startTransition } from 'react';
import SideBar from './SideBar';
import axios from 'axios';
import { useGlobalContext } from './context/context';
import { FaUser, FaRegClock, FaCheckCircle, FaTasks } from 'react-icons/fa';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Loading from './Loading';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { assessments } = useGlobalContext();
    const [alert, setAlert] = useState({ message: '', severity: '' });
    useEffect(() => {
        const getUser = async () => {
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

                const id = localStorage.getItem('userId');

                const response = await axios.get(`http://localhost:4000/auth/${id}`, config);

                startTransition(() => {
                    setUser(response.data);
                });

            } catch (err) {
                console.error('Error fetching user data:', err);
                setError(err);
            } finally {
                startTransition(() => {
                    setLoading(false);
                });
            }
        };

        getUser();
    }, []);

    if (error) return <div>Error: {error.message}</div>;

    // function capitalizeFirstLetter(string) {
    //     return string.charAt(0).toUpperCase() + string.slice(1);
    // }

    const completedCount = assessments.filter(assess => assess.attempted).length;

    return (
        <div className="w-full flex flex-row h-screen">
            <div className="w-full p-4 bg-white rounded-lg shadow-lg flex flex-col m-3 overflow-y-auto h-[calc(100vh-1.5rem)]">
                {loading ? (<Loading />) : (
                    <div>
                        <div className="flex items-center space-x-6 border-b pb-6 mb-2">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
                                <p className="text-xl text-gray-600">{user.emailId}</p>
                            </div>
                        </div>

                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800">Details</h2>
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition-transform duration-300 hover:scale-103">
                                    <Box className="float-right">
                                        <Fab size="small" color="secondary" aria-label="edit">
                                            <FaUser className="text-gray-600" color='white' />
                                        </Fab>
                                    </Box>
                                    <span className="text-gl text-gray-600 ml-3 mr-3">Username:</span>
                                    <span className="text-gl font-semibold text-gray-800">{user.fullName}</span>
                                </div>
                                <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition-transform duration-300 hover:scale-105">
                                    <Box className="float-right">
                                        <Fab size="small" color="secondary" aria-label="edit">
                                            <FaTasks className="text-gray-600" color='white' />
                                        </Fab>
                                    </Box>

                                    <span className="text-gl text-gray-600 ml-3 mr-3">Role:</span>
                                    <span className="text-gl font-semibold text-gray-800">{user.role}</span>
                                </div>
                                <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition-transform duration-300 hover:scale-105">
                                    <Box className="float-right">
                                        <Fab size="small" color="secondary" aria-label="edit">
                                            <FaRegClock className="text-gray-600 " color='white' />
                                        </Fab>
                                    </Box>
                                    <span className="text-gl text-gray-600 ml-3 mr-3">Joined:</span>
                                    <span className="text-gl font-semibold text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition-transform duration-300 hover:scale-105">
                                    <Box className="float-right">
                                        <Fab size="small" color="secondary" aria-label="edit">
                                            <FaTasks className="text-gray-600 " color='white' />
                                        </Fab>
                                    </Box>

                                    <span className="text-gl text-gray-600 ml-3 mr-3">Total Tests:</span>
                                    <span className="text-gl font-semibold text-gray-800">{assessments.length}</span>
                                </div>
                                <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition-transform duration-300 hover:scale-105">
                                    <Box className="float-right">
                                        <Fab size="small" color="secondary" aria-label="edit">
                                            <FaCheckCircle className="text-gray-600" color='white' />
                                        </Fab>
                                    </Box>

                                    <span className="text-gl text-gray-600 ml-3 mr-3">Tests Completed:</span>
                                    <span className="text-gl font-semibold text-gray-800">{completedCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
