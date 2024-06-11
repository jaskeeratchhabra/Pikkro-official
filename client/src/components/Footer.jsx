import React from 'react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className='text-xl mb-10'>
        <h1 className='text-center' >Reach out to us at <span className='font-semibold'>support@pikkro.in</span></h1>
      </div>
      <div className="md:flex md:justify-between mx-auto grid grid-cols-1 gap-5">
        <div className="w-full md:w-1/3 mb-4 md:mb-0 ml-2">
          <h2 className="text-green-500 text-2xl font-extrabold mb-2">Pikkro.com</h2>
          <p className="text-sm">114, Street no 16, Wazirabad Village, New delhi, 110084</p>
          <p className="text-sm font-bold mt-4 underline">Delivery Service in Delhi NCR</p>
        </div>
        <div className="w-full md:w-2/3 flex justify-end mr-auto ml-1">
          <ul className="text-sm mr-8">
            <li className="mb-2"><Link to="/MyOrders" className="hover:text-gray-500">Track Order</Link></li>
            <li className="mb-2"><Link to="/DeliveryPartnerForm" className="hover:text-gray-500">Become Link Delivery Partner</Link></li>
            <li className="mb-2"><Link to="/ForBusiness" className="hover:text-gray-500">For Businesses</Link></li>
            <li className="mb-2"><Link to="/PrivacyPolicy" className="hover:text-gray-500">Privacy Policy</Link></li>
            <li className="mb-2"><Link to="/T&C" className="hover:text-gray-500">T&C</Link></li>
          </ul>
          <ul className="text-sm">
            <li className="mb-2"><Link to="/RiderT&C" className="hover:text-gray-500">Rider's T&C</Link></li>
            <li className="mb-2"><Link to="/cancellation" className="hover:text-gray-500">Cancellation policy and Charges</Link></li>
            <li className="mb-2"><Link to="/CommunityGuidlines" className="hover:text-gray-500">Community Guidelines</Link></li>
            <li className="mb-2"><Link to="/Pricing" className="hover:text-gray-500">Pricing</Link></li>
            <li className="mb-2"><Link to="/Support" className="hover:text-gray-500">Support</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
