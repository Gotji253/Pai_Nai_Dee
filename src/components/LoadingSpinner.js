// components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    <p className="ml-4 text-gray-700">กำลังโหลด...</p>
  </div>
);

export default LoadingSpinner;
