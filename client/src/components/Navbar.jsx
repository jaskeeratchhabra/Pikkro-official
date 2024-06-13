// NavigationBar.js
import React from 'react';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector,useDispatch}  from "react-redux"
import { logout } from '../store/authSlice';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import SideScreen from './SideScreen';
import axios from 'axios';
import Loading from './Loading';
const NavigationBar = () => {
  
  const navigate=useNavigate();
  const location=useLocation();
  const [city,setCity]= useState("");
  const [dropdown,setDropdown]=useState(false);
  const dispatch =useDispatch();
  const loggedIn = useSelector(state=>state.authReducer.status)
  const [isSideScreenOpen, setIsSideScreenOpen] = useState(false);
  const user= JSON.parse(localStorage.getItem("user"))
  const [loading,setLoading]= useState(false);

  const handleDropdown=(e)=>{
    e.preventDefault();
    setDropdown(!dropdown);
  }
 
  const handleSideScreen=()=>{
    setIsSideScreenOpen(!isSideScreenOpen)
  }
  
  const closeSideScreen = () => {
    setIsSideScreenOpen(false);
  };
  

let username=useSelector(state=>state.authReducer.username);
const handleLogout=async()=>{
  const phone = user.phone
  console.log(phone)
  const obj = {phone:phone, onDuty:false};
  try{
    setLoading(true);
    if(user.isRider){
     const data =  (await axios.patch(`https://api.pikkro.com/api/users/${phone}`,obj)).data
     console.log(data);
    }
  }
  catch(error)
  {
    console.log(error.message);
  }
  setLoading(false);
  dispatch(logout())
  localStorage.removeItem("user");
  navigate("/")

}

useEffect(() => {

  // console.log(loggedIn, username)
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    // console.log(username);
    const username=user.name;
    dispatch(login({username}));
  }
}, [dispatch, username]);

useEffect(() => {
  function getCurrentCityLocation() {
      if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(function (position) {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;

              // Use a reverse geocoding service to get the city from the coordinates.
              const geocodingApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;
              
              // Request high accuracy location
              const options = {
                  enableHighAccuracy: true,
                  maximumAge: 10000, // Maximum age of cached position
                  timeout: 10000 // Timeout in milliseconds
              };

              fetch(geocodingApiUrl, options)
                  .then(response => response.json())
                  .then(data => {
                      const city = data.address.city || data.address.town || data.address.village;
                      const area = data.address.neighbourhood || data.address.suburb || data.address.county;
                      console.log(data.address)
                      console.log(area);
                      setCity(city);
                  })
                  .catch(error => console.error(error));
          }, function (error) {
              console.error(error.message);
          }, {
              enableHighAccuracy: true
          });
      } else {
          console.log("Geolocation is not supported by this browser.");
      }
  }
  getCurrentCityLocation();
}, []);

  return (
    <nav className="bg-gray-800">
      
      {loading && <Loading/>}
    <div className="grid md:grid-cols-2 md:px-4 md:ml-12 grid-cols-3">

        <div className="flex items-center h-16">
          <div className="mx-4 md:block hidden ">
            {/* <img className='h-20 w-24 mx-3 my-auto' src="../../images/logo.gif" alt="logo"/> */}
            <Link to="/" className="text-green-500 text-2xl mb-3 font-extrabold my-auto">Pikkro.com</Link>
          </div>
          <div className="text-4xl mx-2 md:hidden text-center">
            {/* <img className='h-20 w-24 mx-3 my-auto' src="../../images/logo.gif" alt="logo"/> */}
            <Link to="/" className="text-green-500 text-2xl font-extrabold">Pikkro</Link>
          </div>
          <div className=" md:flex hidden rounded-sm p-1 left">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <Link to="/" className="text-lg text-gray-200 font-semibold">{city}</Link>
          </div>
          {location.pathname === "/" && (
             <div className=" lg:ml-auto ">
               <Link to="/create-order">
                 <button className="mt-4 w-28 lg:w-48 mb-2 py-2 bg-green-600 text-white rounded-md animate-pulse ">
                   Book Delivery
                 </button>
               </Link>
             </div>
           )}
        </div>

      
      <div className="relative hidden lg:block">
        <div className="flex items-center md:ml-6 my-4 absolute right-10">
          <Link to="/DeliveryPartnerForm">
            <button className="text-gray-300 hover:text-white py-2 text-sm font-medium mr-6">Become a Delivery Partner</button>
          </Link> 
         
          <Link to="/login">
            {
              !loggedIn && <button className='text-gray-300  hover:text-white tex-sm font-medium'>Login/Sign up</button>
            }
          </Link>
          
           {
             (loggedIn) && <button onClick={handleLogout} className='text-gray-300  hover:text-white tex-sm font-medium'>Logout</button>
           }
         
             
           <div className="ml-4 relative">
             <div>
               <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                onClick={handleDropdown}>Hi, {username} ▼</button>
             </div>
             
             {dropdown && <div className="origin-top-right absolute mt-2 w-32 rounded-md shadow-lg bg-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
               <div className="py-1 flex flex-col items-center" role="none">
                 <Link to="/MyOrders" className="my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">My orders</Link>
                 <Link to="/about" className="my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">About us</Link>
                 <Link to="/contact-us" className="my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Contact Us</Link>
                 <Link to="/faqs" className="my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">FAQs</Link>
               </div>
              </div>
               }
            </div>
        </div>
       </div>
        <div className='absolute right-6 mt-4'>
          <div className="md:hidden ">
            <button className="text-gray-300 hover:text-white text-sm font-medium" onClick={handleSideScreen}>
               <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="40px"><path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z" fill="#ffffff"/></svg>
            </button>
            {isSideScreenOpen && (
             <div className="origin-top-right absolute mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
             <div className='my-auto ml-auto mr-20'>
              <div className="lg:hidden">
                <SideScreen isOpen={isSideScreenOpen} onClose={closeSideScreen} loggedIn={loggedIn} username={username} handleLogout={handleLogout} />
              </div>
             </div>
             </div>
           )}
          </div>
         </div>

    </div>
    </nav>
  );
}

export default NavigationBar;

