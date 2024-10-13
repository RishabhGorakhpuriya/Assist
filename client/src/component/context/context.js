import React, { useContext, useState, useEffect, startTransition } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  // Initial state for signup and login
  const initialSignupValue = { fullName: '', emailId: '', password: '', role: '' };
  const [credential, setCredential] = useState(initialSignupValue);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState({});
  const initialLoginValue = { emailId: '', password: '' };
  const [credentialLogin, setCredentialLogin] = useState(initialLoginValue);
  const [severity, setSeverity] = useState('success');



  // Handle changes for signup form
  const SignuphandleChange = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };

  // Validate signup form fields
  const validateSignup = (values) => {
    const errors = {};
    if (!values.fullName) errors.fullName = 'Full name is required';
    if (!values.emailId) errors.emailId = 'Email is required';
    if (!values.password) errors.password = 'Password is required';
    if (!values.role) errors.role = 'Role is required';
    return errors;
  };

  // Handle form submission for signup
  const SignupHandleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateSignup(credential);
    setFormError(errors);

    if (Object.keys(errors).length > 0) {
      return { success: false };
    }

    try {
      await axios.post("http://localhost:4000/auth/signup", credential);
      // Handle successful signup
      setError("Registration Successfull")
      setSeverity('success');
      setTimeout(()=>{
        setSeverity('');
        setError('');
      },2000)
      return { success: true }; 
    } catch (error) {
      setSeverity('error')
      setError('Registration failed. Please try again.');
      setTimeout(()=>{
        setSeverity('');
        setError('');
      },2000)
      return { success: false }; 
    }
  };




  // Handle changes for login form
  const LoginHandleChange = (e) => {
    setCredentialLogin({ ...credentialLogin, [e.target.name]: e.target.value });
  };

  // Validate login form fields
  const validateLogin = (values) => {
    const errors = {};
    if (!values.emailId) errors.emailId = 'Email is required';
    if (!values.password) errors.password = 'Password is required';
    return errors;
  };

  // Handle form submission for login
  const LoginHandleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLogin(credentialLogin);
    setFormError(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/auth/login", credentialLogin);
      // Handle successful login, e.g., store tokens, redirect
      const { token } = response.data;

      console.log(token)

      if (token) {
        // Store the token in local storage
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        localStorage.setItem('fullName', decoded.fullName);
        localStorage.setItem('id', decoded.id);
        localStorage.setItem('emailId', decoded.emailId)
        localStorage.setItem('role', decoded.role)


        // Handle successful login (e.g., redirect to another page)
        console.log("Login successful!");
        setError("Registration Successfull")
        setSeverity('success');
        setTimeout(()=>{
          setSeverity('');
          setError('');
        },2000)
        return { success: true };
        // Redirect or update state as needed
      }
    } catch (error) {
      setSeverity('error');
      setError('Login failed. Please try again.');
      setTimeout(()=>{
        setSeverity('');
        setError('');
      },2000)
      return {success : false}
    }
  };

  const [assessments, setAssessments] = useState([]);
  const [assesserror, setAssessError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const UserRole = localStorage.getItem('role');
  const userId = localStorage.getItem('id');

  
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
            Authorization: `Bearer ${token}`
          }
        };

        let response;
        if (UserRole === 'teacher') {
          response = await axios.get('http://localhost:4000/api/assessment/', config);
        } else {
          response = await axios.get(`http://localhost:4000/api/getAssessment/${userId}`, config);
          let assessment = [];
          let studentAssessmentIds = {};
          response.data.forEach(obj => {
            assessment.push({assessmentId : obj.assessmentId, attempted:obj.attempted});
            studentAssessmentIds[obj.assessmentId.id] = obj.id;
          });
          
          localStorage.setItem('studentAssessmentIds', JSON.stringify(studentAssessmentIds));
          response.data = assessment;    
          
        }

        // Ensure response data is an array before setting state
        const data = Array.isArray(response.data) ? response.data : [];
        setAssessments(data);
        setFilteredAssessments(data); // Initialize filteredAssessments
  
      } catch (error) {
        console.error('Error fetching assessments:', error);
        setAssessments([]); // Reset to empty array on error
        setFilteredAssessments([]); // Reset to empty array on error
        
      } finally {
        setLoading(false); // Always set loading to false after try/catch
      }
    };
    fetchAssessments();
  }, [UserRole, userId]);




  return (
    <AppContext.Provider value={{
      credential,
      loading,
      severity,
      SignuphandleChange,
      SignupHandleSubmit,
      validateSignup,
      formError,
      LoginHandleChange,
      LoginHandleSubmit,
      credentialLogin,
      setCredentialLogin,
      assessments,
      assesserror,
      setFilteredAssessments,
      searchTerm,
      setSearchTerm,
      error,
      UserRole,
      filteredAssessments,
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within an AppProvider');
  }
  return context;
};

export { AppContext, useGlobalContext, AppProvider };
