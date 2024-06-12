
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SuccessComponent from '../components/SuccessComponent';
import Loading from "../components/Loading";
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [loading,setLoading]=useState(false);
  const [showPassword,setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [Cpassword,setCPassword]= useState(false)
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword:''
  });
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
    const handleGeneration = async(e)=>{
      e.preventDefault();
      const phone = formData.phone;
      const data = (await axios.post("https://api.pikkro.com/api/users/generateOTP",{number:phone})).data;
      console.log(data)
      setCode(data); 
      setStatus(true);
    }
   const handleVerification=(e)=>{
         e.preventDefault();
         console.log( otp.join(''), code)
         if(otp.join('')=== String(code))
          {
            console.log(otp , code , typeof otp, typeof code)
            console.log("otp verified successfully");
            setStatus("verified");
            setError("Otp verification done")
          }
   }
 
  
  const toggelCpassword=()=>{
    setCPassword((prevstate)=>!prevstate);
  }
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  }; 
    

  const handleChange = (e) => {
      const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    if(OtpStatus!=="verified")
    {
      setError("verify your phone number");
      return ;
    }
    e.preventDefault();
    const { phone, password } = formData;
    const user = { phone, password };
    try {
      setLoading(true);
      const result = (await axios.patch(`https://api.pikkro.com/api/users/:${phone}`, user)).data;
      if (result) {
          setSuccess(true);
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
    setLoading(false);
  };

  return (
       <>
       <div className='text-center mt-10 text-xl font-semibold text-red-500 '>{error&&<h1>{error}</h1>}</div>
      {success && <SuccessComponent className="top" message="Password updated successfully"/>}
      <div className="relative flex justify-center items-center h-screen bg-gray-100">
      {loading && <Loading/>}
      <div className="bg-white shadow-md rounded-md p-8 mb-3 w-full max-w-sm">
        <h2 className="text-3xl font-semibold mb-4 text-center">Set new password</h2>
        <form onSubmit={handleSubmit}>
        <div className='flex '>
          <span className='text-center text-gray-700 font-semibold mt-2'>+91</span>
          <div className="mb-4">
          <div className='flex'>
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
           {formData.phone && <button className='bg-blue-700 text-white h-fit mx-2 px-1 rounded-sm ' onClick={handleGeneration}>Ask For OTP</button>}
           </div>
           {
             <div>
                 <h2 className='mt-3'>Enter OTP</h2>
                 <div className='flex'>
                     <div className="w-fit ">
                         {otp.map((digit, index) => (
                             <input
                                 key={index}
                                 type="text"
                                 className="h-5 w-5 border border-black mx-1 rounded-lg"
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
        </div>
          </div>
          <div className="mb-6 flex">
            <input
              type= {showPassword ?"text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
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
          <div className="mb-6 flex">
            <input
              type= {Cpassword ?"text" : "password"}
              name="confirmPassword"
              id="confirmpassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
              {!Cpassword? (
                <EyeOffIcon
                  className="h-6 w-6 ml-2 text-gray-500 cursor-pointer"
                  onClick={toggelCpassword}
                />
              ) : (
                <EyeIcon
                  className="h-6 w-6 ml-2 text-gray-500 cursor-pointer"
                  onClick={toggelCpassword}
                />
              )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Update
          </button>
             <span>Don't have an account 
             <Link to="/register" className="mx-2 text-blue-500 font-semibold">Sign Up</Link></span>
             <Link to="/login" className="absolute mt-5  text-blue-800"> Back to Login</Link>
        </form>
      </div>
    </div>
    </>
  );
};

export default ForgotPassword;