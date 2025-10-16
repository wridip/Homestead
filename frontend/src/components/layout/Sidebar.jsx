import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">Host Dashboard</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" end className={({ isActive }) => `block py-2 px-4 rounded ${isActive ? 'bg-gray-700' : ''}`}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/properties" className={({ isActive }) => `block py-2 px-4 rounded ${isActive ? 'bg-gray-700' : ''}`}>
              Manage Properties
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/bookings" className={({ isActive }) => `block py-2 px-4 rounded ${isActive ? 'bg-gray-700' : ''}`}>
              Bookings
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/profile" className={({ isActive }) => `block py-2 px-4 rounded ${isActive ? 'bg-gray-700' : ''}`}>
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;