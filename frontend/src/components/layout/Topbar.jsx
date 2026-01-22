import React from 'react';
import { Link } from 'react-router-dom';

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="flex items-center gap-3 px-4 md:px-6 h-16">
        <button
          onClick={onMenuClick}
          className="md:hidden inline-flex items-center justify-center rounded-md border border-[rgba(255,255,255,0.1)] p-2 text-[#E0E0E0]/80 hover:bg-[rgba(255,255,255,0.05)] transition"
          aria-label="Open sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M4 5h16"></path>
            <path d="M4 12h16"></path>
            <path d="M4 19h16"></path>
          </svg>
        </button>
        <div className="ml-auto flex items-center gap-2">
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