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
    <header className={`fixed transition-all z-50 top-0 right-0 left-0 ${scrolled ? 'backdrop-blur bg-background/70 border-b border-border' : ''}`}>
      <div id="progressBar" className="absolute left-0 top-0 h-[2px] bg-primary" style={{ width: `${progress}%` }}></div>
      <div className="flex sm:px-6 lg:px-8 h-16 max-w-7xl mr-auto ml-auto pr-4 pl-4 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-primary">🌲 homestead.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/" className="transition-colors hover:text-primary text-foreground">Home</Link>
          <Link to="/explore" className="transition-colors hover:text-primary text-foreground">Explore</Link>
          {isAuthenticated && (user?.role === 'Host' || user?.role === 'Admin') && (
            <Link to="/dashboard" className="transition-colors hover:text-primary text-foreground">Dashboard</Link>
          )}
          {isAuthenticated && user?.role === 'Traveler' && (
            <Link to="/my-profile/About-me" className="transition-colors hover:text-primary text-foreground">My Profile</Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-foreground">Welcome, {user?.name}</span>
              <button onClick={logout} className="btn-adaptive rounded-md px-3 py-1.5 text-sm font-medium border transition-colors text-foreground border-border hover:bg-accent">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-adaptive rounded-md px-3 py-1.5 text-sm font-medium border transition-colors text-foreground border-border hover:bg-accent">Login</Link>
              <Link to="/signup" className="btn-adaptive rounded-md px-3.5 py-2 text-sm font-semibold border transition-colors text-primary-foreground bg-primary border-primary hover:bg-opacity-80">Sign Up</Link>
            </>
          )}
          <button id="mobileMenuBtn" className="md:hidden inline-flex items-center justify-center rounded-md border border-border p-2 text-foreground/80 hover:bg-accent transition" aria-label="Open Menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div id="mobileMenu" className="border-t border-border bg-background md:hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-1">
            <Link to="/" className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">Home</Link>
            <Link to="/explore" className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">Explore</Link>
            {isAuthenticated && (user?.role === 'Host' || user?.role === 'Admin') && (
              <Link to="/dashboard" className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">Dashboard</Link>
            )}
            {isAuthenticated && user?.role === 'Traveler' && (
              <Link to="/my-profile/About-me" className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">My Profile</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;