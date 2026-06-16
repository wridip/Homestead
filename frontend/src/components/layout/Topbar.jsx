import React from 'react';
import { Link } from 'react-router-dom';

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-background/40 border-b border-border">
      <div className="flex items-center gap-3 px-4 md:px-6 h-16">
        <button
          onClick={onMenuClick}
          className="md:hidden inline-flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground hover:bg-accent transition"
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
        </div>
      </div>
    </header>
  );
};

export default Topbar;