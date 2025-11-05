import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = () => {
    const sy = window.scrollY || document.documentElement.scrollTop;
    setScrolled(sy > 6);

    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max ? (sy / max) * 100 : 0;
    setProgress(pct);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed transition-all z-50 top-0 right-0 left-0 ${scrolled ? 'backdrop-blur bg-[#121212]/70 border-b border-[rgba(255,255,255,0.1)]' : ''}`}>
      <div id="progressBar" className="absolute left-0 top-0 h-[2px] bg-[#BB86FC]" style={{ width: `${progress}%` }}></div>
      <div className="flex sm:px-6 lg:px-8 h-16 max-w-7xl mr-auto ml-auto pr-4 pl-4 items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-neutral-500">Homestead</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/" className="transition-colors hover:text-white text-neutral-500">Home</Link>
          <Link to="/explore" className="transition-colors hover:text-white text-neutral-500">Explore</Link>
          {isAuthenticated && user?.role === 'Host' && (
            <Link to="/dashboard" className="transition-colors hover:text-white text-neutral-500">Dashboard</Link>
          )}
          {isAuthenticated && user?.role === 'Traveler' && (
            <Link to="/my-bookings" className="transition-colors hover:text-white text-neutral-500">My Bookings</Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-neutral-500">Welcome, {user?.name}</span>
              <button onClick={logout} className="btn-adaptive rounded-md px-3 py-1.5 text-sm font-medium border transition-colors text-[#E0E0E0] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-adaptive rounded-md px-3 py-1.5 text-sm font-medium border transition-colors text-neutral-500 border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]">Login</Link>
              <Link to="/signup" className="btn-adaptive rounded-md px-3.5 py-2 text-sm font-semibold border transition-colors text-[#121212] bg-[#BB86FC] border-[#BB86FC] hover:bg-opacity-80">Sign Up</Link>
            </>
          )}
          <button id="mobileMenuBtn" className="md:hidden inline-flex items-center justify-center rounded-md border border-[rgba(255,255,255,0.1)] p-2 text-[#E0E0E0]/80 hover:bg-[rgba(255,255,255,0.05)] transition" aria-label="Open Menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div id="mobileMenu" className="border-t border-[rgba(255,255,255,0.1)] bg-[#121212] md:hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-1">
            <Link to="/" className="rounded-md px-3 py-2 text-sm text-neutral-500 hover:bg-[rgba(255,255,255,0.05)]">Home</Link>
            <Link to="/explore" className="rounded-md px-3 py-2 text-sm text-neutral-500 hover:bg-[rgba(255,255,255,0.05)]">Explore</Link>
            {isAuthenticated && user?.role === 'Host' && (
              <Link to="/dashboard" className="rounded-md px-3 py-2 text-sm text-neutral-500 hover:bg-[rgba(255,255,255,0.05)]">Dashboard</Link>
            )}
            {isAuthenticated && user?.role === 'Traveler' && (
              <Link to="/my-bookings" className="rounded-md px-3 py-2 text-sm text-neutral-500 hover:bg-[rgba(255,255,255,0.05)]">My Bookings</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;