import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="fixed -translate-x-full md:translate-x-0 transition-transform duration-300 supports-[backdrop-filter]:bg-black/40 bg-black/60 w-72 z-40 border-white/10 border-r top-0 bottom-0 left-0 backdrop-blur" id="sidebar">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
        <div>
          <p className="text-[15px] font-semibold text-white tracking-tight">
            Homestead
          </p>
          <p className="text-[12px] text-neutral-400">Host Console</p>
        </div>
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
      </nav>

      <div className="mt-auto px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
          <div className="flex-1">
            <p className="text-[14px] font-medium">Welcome, Host</p>
            <p className="text-[12px] text-neutral-400">host@offbeatstays.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;