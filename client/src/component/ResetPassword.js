import React, { useState } from 'react'
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import axios from 'axios';
import { useParams } from 'react-router-dom';
const ResetPassword = () => {
  const [showpassword, setShowPassword] = useState(false);
  const [showpassword1, setShowPassword1] = useState(false);
  const [value, setValues] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const { token } = useParams;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:4000/auth/reset-password/${token}`, {newPassword :value.newPassword,});
      console.log(response.data);
      setMsg("Password Successfully change");
    } catch (error) {
      setMsg("Error has been occure");
      console.error("errors");
    }
  }


  return (
    <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Login to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Create New Password
            </label>
            <div className="mt-2">
              <div className="password-container relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showpassword ? "text" : "password"}
                  value={value.newPassword}
                  onChange={(e) => setValues(e.target.value)}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className='showHidePassword absolute top-1 right-4 cursor-pointer' onClick={() => setShowPassword(!showpassword)}>
                  {showpassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Conform Password
            </label>
            <div className="mt-2">
              <div className="password-container relative">
                <input
                  id="password"
                  name="conformPassword"
                  type={showpassword1 ? "text" : "password"}
                  value={value.conformPassword}
                  onChange={(e) => setValues(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className='showHidePassword absolute top-1 right-4 cursor-pointer' onClick={() => setShowPassword1(!showpassword1)}>
                  {showpassword1 ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </div>
              </div>
            </div>
          </div>
          <span>{msg}</span>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
