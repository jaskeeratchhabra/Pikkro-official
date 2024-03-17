// NavigationBar.js
import React from 'react';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector,useDispatch}  from "react-redux"
import { logout } from '../store/authSlice';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
const NavigationBar = () => {
  
  const navigate=useNavigate();
  const location=useLocation();
  const [city,setCity]= useState("");
  const [dropdown,setDropdown]=useState(false);
  const dispatch =useDispatch();
  const loggedIn = useSelector(state=>state.status)

  const handleDropdown=(e)=>{
    e.preventDefault();
    setDropdown(!dropdown);
  }
  

let username=useSelector(state=>state.username);
const handleLogout=()=>{
   localStorage.removeItem("user");
   dispatch(logout())
   navigate("/")

}

useEffect(() => {
  // Check if user is logged in from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    // console.log(username);
    const username=user.name;
    dispatch(login({username}));
  }
}, [dispatch]);

  useEffect(()=>{
    function getCurrentCityLocation() {
       if ("geolocation" in navigator) {
           navigator.geolocation.getCurrentPosition(function (position) {
               const latitude = position.coords.latitude;
               const longitude = position.coords.longitude;   
               // Use a reverse geocoding service to get the city from the coordinates.
               const geocodingApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;
               fetch(geocodingApiUrl)
                 .then(response => response.json())
                 .then(data => {
                   const city = data.address.city || data.address.town || data.address.village;
                   setCity(city);
                 })
                 .catch(error => console.error(error));

           });
       } 
       else {
           console.log("no location available");
       }
    }
    getCurrentCityLocation();
  },[])

  return (
    <nav className="bg-gray-800">
      
    <div className="grid md:grid-cols-2 px-8 mx-12">

        <div className="flex items-center h-16">
          <div className="text-2xl mx-4 flex">
            {/* <img className='h-20 w-24 mx-3 my-auto' src="../../images/logo.gif" alt="logo"/> */}
            <a href="/" className="text-green-500 text-2xl font-extrabold my-auto">Pikkro.com</a>
          </div>
          <div className=" flex rounded-sm p-1 left">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <a href="/" className="text-lg text-gray-200 font-semibold">{city}</a>
          </div>
          {location.pathname === "/" && (
             <div className=" mx-12">
               <Link to="/create-order">
                 <button className="mt-4 w-48 mb-2 py-2 bg-green-600 text-white rounded-md animate-pulse">
                   Book Delivery Now
                 </button>
               </Link>
             </div>
           )}
        </div>

      
      <div className="relative hidden lg:block">
        <div className="flex items-center md:ml-6 my-4 absolute right-0">
          <a href="/DeliveryPartnerForm" className="text-gray-300 hover:text-white py-2 text-sm font-medium mr-6">Become a Delivery Partner</a>
         
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
             
             {dropdown && <div className="origin-top-right absolute mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
               <div className="py-1 flex flex-col items-center" role="none">
                 <a href="/MyOrders" className="border  my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">My orders</a>
                 <a href="#" className="border  my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">About us</a>
                 <a href="#" className="border  my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Contact Us</a>
                 <a href="#" className="border  my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">FAQs</a>
               </div>
              </div>
               }
            </div>
        </div>

       </div>

      </div>
    </nav>
  );
}

export default NavigationBar;

