import React from 'react';
import { Link } from 'react-router-dom';

const Topbar = () => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div>
        {/* Can add search or other controls here */}
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Welcome, Host!</span>
        <Link to="/" className="text-sm text-blue-500 hover:underline">View Site</Link>
        <button className="text-sm text-red-500 hover:underline">Logout</button>
      </div>
    </div>
  );
};

export default Topbar;