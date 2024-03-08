// NavigationBar.js
import React from 'react';
import { useState,useEffect } from 'react';
const NavigationBar = () => {
  
  const [city,setCity]= useState("");
  const [dropdown,setDropdown]=useState(false);
  const handleDropdown=(e)=>{
    e.preventDefault();
    setDropdown(!dropdown);
  }

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between">
        <div className="flex items-center h-16">
          <div className="text-2xl mx-4">
            <a href="/" className="text-white text-lg font-semibold">Pikkro.com</a>
          </div>
          <div className=" flex rounded-sm p-1 left">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <a href="/" className="text-lg text-gray-200 font-semibold">{city}</a>
          </div>
          </div>

          <div className="flex justify-center">
            <button className="mt-2 p-3 w-64 mb-2 bg-green-600 text-white rounded-md animate-pulse">
              Book Delivery Now
            </button>
          </div>
          <div className="hidden md:block">
           <div>
            <div className="ml-4 flex items-center md:ml-6 my-4">
            
              <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Become a Delivery Partner</a>
              <div className="ml-3 relative">
                <div>
                  <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                   onClick={handleDropdown}>Hi, Guest ▼</button>
                </div>
                
                {dropdown && <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                  <div className="py-1" role="none">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Login/Signup</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">My Orders</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Contact Us</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">FAQs</a>
                  </div>
                </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;

