import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-2xl mt-4 text-gray-600">Page Not Found</p>
      <p className="mt-2 text-gray-500">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;