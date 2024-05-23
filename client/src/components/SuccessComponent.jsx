/* eslint-disable react/prop-types */
// import React from 'react';

const SuccessComponent = ({ message }) => {
  return (
    <div className="bg-white border text-green-700 px-4 py-3 rounded relative text-center" role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  );
}

export default SuccessComponent;
