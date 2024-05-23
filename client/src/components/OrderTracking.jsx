/* eslint-disable react/prop-types */
import React from 'react';

const OrderTracking = ({ order }) => {
  const getStatusSteps = () => {
    if (order.canceled) {
      return ['Canceled'];
    }

    const steps = [];
    if (order.accepted) steps.push('Accepted');
    if (order.picked) steps.push('Picked');
    if (order.completed) steps.push('Delivered');

    return steps;
  };

  const steps = getStatusSteps();

  return (
    <div className="w-full max-w-md mx-auto">
       {
         steps.length===0 && <h1>Your order will be accepted soon</h1>
       }
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="relative flex-1">
            <div className={`w-10 h-10 rounded-full border border-blue-500 flex items-center justify-center ${index <= steps.length - 1 ? ' text-blue-500' : 'bg-gray-500 text-gray-600'}`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`absolute top-1/2 transform -translate-y-1/2 left-12 right-0 h-1 ${index <steps.length - 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
            )}
            <div className="mt-2 text-center">
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
