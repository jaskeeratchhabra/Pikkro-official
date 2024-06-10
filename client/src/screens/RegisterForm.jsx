import React, {useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import SuccessComponent from '../components/SuccessComponent';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { EyeIcon,EyeOffIcon } from '@heroicons/react/solid';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
    
  const dispatch = useDispatch();
  const [Cpassword,setCPassword]= useState(false);
  const [emailValid, setEmailValid] = useState(true);

  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success,setSuccess]=useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [OtpStatus,setStatus] = useState("");
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [code,setCode] = useState("");
  const refs = useRef([]);

    const handleOTPChange = (index, value) => {
        const newOTP = [...otp];
        newOTP[index] = value;
        setOTP(newOTP);

        if (value && index < otp.length - 1) {
            refs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            refs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData('Text');
        if (pasteData.length === otp.length && /^\d+$/.test(pasteData)) {
            setOTP(pasteData.split(''));
        }
    };
  const [formData, setFormData] = useState({
      name: '',
      email:'',
      phone: '',
      password: '',
      cpassword: ''
    });
    
    const handleGeneration = async(e)=>{
      e.preventDefault();
      const phone = formData.phone;
      const data = (await axios.post("http://localhost:5000/api/users/generateOTP",{number:phone})).data;
      console.log(data)
      setCode(data); 
      // setStatus(true);
    }
   const handleVerification=(e)=>{
         e.preventDefault();
         console.log( otp.join(''), code)
         if(otp.join('')=== String(code))
          {
            console.log(otp , code , typeof otp, typeof code)
            console.log("otp verified successfully");
            setStatus("verified");
          }
   }
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
    if(OtpStatus!=="verified")
    {
      console.log(OtpStatus)
      setError("Verify otp and sign up again")
      return ;
    }
    const { name, phone,email, password, cpassword } = formData;
    const user = {
      name,
      email,
      phone,
      password,
      cpassword,
      isAdmin:false,
      isRider:false
    };
    try {
      setLoading(true);
      const result = (await axios.post("http://localhost:5000/api/users/register", user)).data;
      if(result){
        setSuccess(true);
        localStorage.setItem("user",JSON.stringify(result));
        const username=result.name
        dispatch(login({username}));
      }
      navigate("/");
      console.log(result);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      setError(error.message);
      console.log(error);
    }
    setLoading(false);
    console.log(formData);
  }

  return (
    <>
     {success && <SuccessComponent message="User Registered SuccessFully"/>}
      <div className='text-center mt-10 text-xl font-semibold text-red-500 '>{error&& <SuccessComponent message="Registration failed try again"/>}</div>
      <div className="flex justify-center items-center h-screen">
      {loading && <Loading />}
      <form className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
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
        <div className='flex items-center'>
          <span className='text-gray-700'>+91</span>
           <div className="">
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
          {formData.phone && <button className='bg-blue-700 text-white h-fit mx-2 px-1 rounded-sm ' onClick={handleGeneration}>Ask For OTP</button>}
        </div>
        {
        <div>
            <h2 className='mt-3 ml-1'>Enter OTP</h2>
            <div className='flex'>
                <div className="w-fit ">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            className="h-5 w-5 border rounded-md border-black mx-1"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOTPChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            ref={(el) => (refs.current[index] = el)}
        
                        />
                    ))}
                </div>
                <button className='px-1 bg-blue-700 text-white ml-2 rounded-md' onClick={handleVerification}>Verify</button>
            </div>
        </div>
        }
        {OtpStatus==="verified" && <SuccessComponent message="Phone number verified"/>}
        <span className='text-gray-500 mx-2'>Verify your phone number to proceed further.</span>
         
        <div className="mb-4 mt-4">
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
          <button
            type="button"
            className="absolute top-1/2 right-2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon className="h-6 w-6 text-gray-400" /> : <EyeIcon className="h-6 w-6 text-gray-400" />}
          </button>
        </div>
        <div className="mb-6 relative">
          <input
            type="password"
            name="cpassword"
            value={formData.cpassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-purple-500"
            autoComplete="false"
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 transform -translate-y-1/2"
            onClick={() => setCPassword(!Cpassword)}
          >
            {Cpassword ? <EyeOffIcon className="h-6 w-6 text-gray-400" /> : <EyeIcon className="h-6 w-6 text-gray-400" />}
          </button>
        </div>
       
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:bg-purple-700"
          onClick={handleSubmit}
        >
          Sign Up
        </button>
        
        <div className='relative'>
            <Link to="/login" className= "text-blue-700 absolute right-0"> Back to Login</Link>
        </div>
      </form>
    </div>
    </>
  );
};

export default RegisterForm;