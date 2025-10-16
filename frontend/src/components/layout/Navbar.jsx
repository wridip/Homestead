import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            <Link to="/">Homestead</Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="text-gray-600 hover:text-blue-500">Explore</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-500">About</Link>
            {isAuthenticated && user?.role === 'Host' && (
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-500">Dashboard</Link>
            )}
            {isAuthenticated && user?.role === 'Traveler' && (
              <Link to="/my-bookings" className="text-gray-600 hover:text-blue-500">My Bookings</Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-800">Welcome, {user?.name}</span>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-500">Login</Link>
                <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;