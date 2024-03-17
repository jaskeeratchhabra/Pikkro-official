import React, {useState } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import SuccessComponent from '../components/SuccessComponent';
// import { EyeIcon,EyeOffIcon } from '@heroicons/react/solid';

const RegisterForm = () => {
    
  const [emailValid, setEmailValid] = useState(true);

  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success,setSuccess]=useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
      name: '',
      email:'',
      phone: '',
      password: '',
      cpassword: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if(name==="email"){
            validateEmail(value);
        }
    };

    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(regex.test(email));
    };

  async function handleSubmit(e) {
    e.preventDefault();
    const { name, phone,email, password, cpassword } = formData;
    const user = {
      name,
      email,
      phone,
      password,
      cpassword
    };
    try {
      setLoading(true);
      const data = (await axios.post("/api/users/register", user)).data;
      if(data){
        setSuccess(true);
      }
      navigate("/");
      console.log(data);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      setError(true);
      console.log(error);
    }
    setLoading(false);
    console.log(formData);
  }

  return (
    <>
     {success && <SuccessComponent message="User Redistered SuccessFully"/>}
    <div className="flex justify-center items-center h-screen">
      {error&&<h1>User already registered go to login</h1>}
      {loading && <Loading />}
      <form className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            pattern="[0-9]{10}"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Id"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                emailValid ? 'focus:border-purple-500' : 'border-red-500'
              }`}
            />
            {!emailValid && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
            )}
        </div>
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-purple-500"
          />
          {/* <button
            type="button"
            className="absolute top-1/2 right-2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon className="h-6 w-6 text-gray-400" /> : <EyeIcon className="h-6 w-6 text-gray-400" />}
          </button> */}
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="cpassword"
            value={formData.cpassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-purple-500"
            autoComplete="false"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:bg-purple-700"
        >
          Sign Up
        </button>
      </form>
    </div>
    </>
  );
};

export default RegisterForm;