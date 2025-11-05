import React from 'react';
import { Link } from 'react-router-dom';

const Topbar = () => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="flex items-center gap-3 px-4 md:px-6 h-16">
        <div className="relative hidden md:flex w-full max-w-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
          <input type="text" placeholder="Search bookings, guests, properties..." className="w-full pl-10 pr-3 h-10 rounded-lg bg-white/5 border border-white/10 text-[14px] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/30" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link to="/" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-white/10 hover:bg-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye h-4 w-4"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span className="text-[14px] font-medium">View Site</span>
          </Link>
          <Link to="/dashboard/add-property" className="inline-flex items-center gap-2 h-10 px-3 rounded-lg text-white bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-4 w-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            <span className="text-[14px] font-medium">Add Property</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Topbar;