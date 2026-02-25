import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const ProfileLayout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="pt-24 min-h-screen bg-[#0F0F0F] text-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <h2 className="text-3xl font-bold mb-8">My Profile</h2>
            <nav className="flex lg:flex-col overflow-x-auto pb-4 lg:pb-0 gap-2 lg:gap-1 scrollbar-hide">
              <NavLink
                to="/my-profile/About-me"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#BB86FC] text-[#121212] shadow-lg shadow-[#BB86FC]/20'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span className="font-medium">About me</span>
              </NavLink>
              <NavLink
                to="/my-profile/messages"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#BB86FC] text-[#121212] shadow-lg shadow-[#BB86FC]/20'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                <span className="font-medium">Messages</span>
              </NavLink>
              {user?.role === 'Traveler' && (
                <NavLink
                  to="/my-profile/bookings"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#BB86FC] text-[#121212] shadow-lg shadow-[#BB86FC]/20'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg>
                  <span className="font-medium">My Bookings</span>
                </NavLink>
              )}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-neutral-900/50 rounded-3xl border border-neutral-800 p-6 md:p-8 min-h-[600px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
