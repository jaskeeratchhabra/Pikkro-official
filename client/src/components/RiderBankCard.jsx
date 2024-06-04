/* eslint-disable react/prop-types */
// src/components/RiderBankCard.jsx

import React from 'react';

const RiderBankCard = ({ rider }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white">
      <div className="font-bold text-xl mb-2">{rider.RiderName}</div>
      <p className="text-gray-700 text-base">
        Phone: {rider.RiderPhone}
      </p>
      <p className="text-gray-700 text-base">
        Account Holder: {rider.accountHolderName}
      </p>
      <p className="text-gray-700 text-base">
        Account Number: {rider.accountNumber}
      </p>
      <p className="text-gray-700 text-base">
        Bank Name: {rider.bankName}
      </p>
      <p className="text-gray-700 text-base">
        Bank Branch: {rider.bankBranch}
      </p>
      <p className="text-gray-700 text-base">
        IFSC Code: {rider.ifscCode}
      </p>
    </div>
  );
};

export default RiderBankCard;
