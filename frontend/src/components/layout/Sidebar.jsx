import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';

const Sidebar = ({ isSidebarOpen, sidebarRef }) => {
  const { user } = useContext(AuthContext);

  return (
    <aside ref={sidebarRef} className={`fixed ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 supports-[backdrop-filter]:bg-black/40 bg-black/60 w-72 z-40 border-white/10 border-r top-0 bottom-0 left-0 backdrop-blur`} id="sidebar">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
        <Link to="/" className="inline-flex items-center gap-2">
          <div>
            <p className="text-xl font-semibold tracking-tight text-[#BB86FC]">
              Homestead
            </p>
            <p className="text-[12px] text-neutral-400">Host Console</p>
          </div>
        </Link>
      </div>

      <nav className="px-3 py-4 space-y-1">
        <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'text-neutral-300 hover:text-white hover:bg-white/5'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid h-5 w-5"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
          <span className="text-[14px] font-medium">Dashboard</span>
        </NavLink>
        <NavLink to="/dashboard/properties" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'text-neutral-300 hover:text-white hover:bg-white/5'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home h-5 w-5"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          <span className="text-[14px] font-medium">Manage Properties</span>
        </NavLink>
        <NavLink to="/dashboard/bookings" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'text-neutral-300 hover:text-white hover:bg-white/5'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check h-5 w-5"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg>
          <span className="text-[14px] font-medium">Bookings</span>
        </NavLink>
        <NavLink to="/dashboard/messages" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'text-neutral-300 hover:text-white hover:bg-white/5'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail h-5 w-5"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
          <span className="text-[14px] font-medium">Messages</span>
        </NavLink>
        <NavLink to="/dashboard/audit" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'text-neutral-300 hover:text-white hover:bg-white/5'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text h-5 w-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
          <span className="text-[14px] font-medium">Earnings Audit</span>
        </NavLink>
        <NavLink to="/dashboard/profile" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'text-neutral-300 hover:text-white hover:bg-white/5'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-5 w-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span className="text-[14px] font-medium">My Profile</span>
        </NavLink>
      </nav>

      <div className="mt-auto px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
          <div className="flex-1">
            <p className="text-[14px] font-medium">Welcome, {user?.name}</p>
            <p className="text-[12px] text-neutral-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;