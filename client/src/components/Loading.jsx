import React from 'react';

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
      <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-200"></div>
    </div>
  )
}

export default Loading;