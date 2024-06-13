import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SuccessComponent from '../components/SuccessComponent';
import Loading from "../components/Loading";
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {login} from "../store/authSlice"

const LoginForm = () => {
  const [loading,setLoading]=useState(false);
  const [showPassword,setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
 
  

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  }; 
    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { phone, password } = formData;
    const user = { phone, password };
    try {
      setLoading(true);
      const result = (await axios.post("https://api.pikkro.com/api/users/login", user)).data;
      if (result) {
        setSuccess(true);
        console.log(result)
        localStorage.setItem("user",JSON.stringify(result));
        const username=result.name
        // console.log(result);
        dispatch(login({username}));
        const Admin=(JSON.parse(localStorage.getItem("user"))).isAdmin;
        const Rider =(JSON.parse(localStorage.getItem("user"))).isRider;
        // console.log(Rider);
        if(Admin){
         navigate("/Admin");
        }
        else
        if(Rider){
          navigate("/Rider")
        }
        else{
           navigate("/");
        }
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
    setLoading(false);
  };

  return (
       <>
      {success && <SuccessComponent className="top" message="Logged In SuccessFully"/>}
      {error &&  <SuccessComponent className="top" message="User not found!"/>}
      <div className="relative flex justify-center items-center h-screen bg-gray-100">
      {loading && <Loading/>}
      <div className="bg-white shadow-md rounded-md p-8 mb-3 w-full max-w-sm">
        <h2 className="text-3xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit} className='relative'>
          <div className="mb-4">
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-6 flex">
            <input
              type= {showPassword ?"text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
              {!showPassword ? (
                <EyeOffIcon
                  className="h-6 w-6 ml-2 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <EyeIcon
                  className="h-6 w-6 ml-2 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Sign In
          </button>
          <div className='flex'>
             <span>Don't have an account 
             <Link to="/register" className="mx-2 text-blue-500 font-semibold">Sign Up</Link></span>
          </div>
             <Link to="/forgotPassword" className="absolute right-2 text-blue-800">Forgot password?</Link>
        </form>
      </div>
    </div>
    </>
  );
};

export default LoginForm;