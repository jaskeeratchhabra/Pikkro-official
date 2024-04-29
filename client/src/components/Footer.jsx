import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="flex md:justify-between mx-auto">
        <div className="w-full md:w-1/3 mb-4 md:mb-0 ml-2">
          <h2 className="text-green-500 text-2xl font-extrabold mb-2">Pikkro.com</h2>
          <p className="text-sm">123 Street, City, Country</p>
          <p className="text-sm font-bold mt-4">Courier Service in Delhi NCR</p>
        </div>
        <div className="w-full md:w-2/3 flex justify-end mr-4">
          <ul className="text-sm mr-8">
            <li className="mb-2"><a href="#" className="hover:text-gray-500">Track Order</a></li>
            <li className="mb-2"><a href="#" className="hover:text-gray-500">Become a Delivery Partner</a></li>
            <li className="mb-2"><a href="#" className="hover:text-gray-500">For Businesses</a></li>
            <li className="mb-2"><a href="#" className="hover:text-gray-500">Privacy Policy</a></li>
            <li className="mb-2"><a href="#" className="hover:text-gray-500">FAQs</a></li>
          </ul>
          <ul className="text-sm">
            <li className="mb-2"><a href="#" className="hover:text-gray-500">Disclaimers & Dispute Resolution</a></li>
            <li className="mb-2"><a href="#" className="hover:text-gray-500">Refund and Cancellation</a></li>
            <li className="mb-2"><a href="#" className="hover:text-gray-500">Community Guidelines</a></li>
            <li className="mb-2"><a href="#" className="hover:text-gray-500">Pricing</a></li>
            <li className="mb-2"><a href="#" className="hover:text-gray-500">Terms and Conditions</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
