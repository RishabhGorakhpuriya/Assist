import React from 'react';
import { Navigate } from 'react-router-dom';

const Protect = ({ children }) => {
    const token = localStorage.getItem('token');

    const isTokenExpired = (token) => {
        if (!token) return true;

        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
        console.log("payload ",payload);
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        console.log(expirationTime);
        return Date.now() > expirationTime; // Check if current time is greater than expiration time
        
    };

    if (!token || isTokenExpired(token)) {
        return <Navigate to="/login" replace={true} />;
    }

    return children;
};

export default Protect;
