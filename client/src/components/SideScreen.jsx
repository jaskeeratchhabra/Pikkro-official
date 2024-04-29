// SideScreen.js
import React from 'react';
import { Link } from 'react-router-dom';

function SideScreen({isOpen, onClose, loggedIn, username, handleLogout }) {
  return (
    <div className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4">
        <button className="text-gray-300 hover:text-gray-600 absolute top-4 right-4" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div className="py-1 flex flex-col items-center">
          <span>  Hi, {username && username} </span>
          <a href="/MyOrders" className="my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">My orders</a>
          <a href="#" className="my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">About us</a>
          <a href="#" className="my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Contact Us</a>
          <a href="#" className="my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">FAQs</a>
          {!loggedIn && (
            <Link to="/login">
              <button className='my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100' role="menuitem">Login/Sign up</button>
            </Link>
          )}
          {loggedIn && (
            <button onClick={handleLogout} className='my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100' role="menuitem">Logout</button>
          )}
          <a href="/DeliveryPartnerForm" className="my-2 w-full text-center text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Become a Delivery Partner</a>
        </div>
      </div>
    </div>
  );
}

export default SideScreen;
