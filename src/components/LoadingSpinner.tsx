
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="container mx-auto py-32 text-center">
      <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
