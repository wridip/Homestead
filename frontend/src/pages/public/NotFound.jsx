import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-neutral-800">
      <h1 className="text-6xl font-bold text-neutral-200">404</h1>
      <p className="text-2xl mt-4 text-neutral-400">Page Not Found</p>
      <p className="mt-2 text-neutral-500">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;