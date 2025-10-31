import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';
import { ThemeContext } from '../../context/ThemeContext.jsx';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://unpkg.com/lucide@latest";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex sm:px-6 lg:px-8 w-full h-16 max-w-7xl mr-auto ml-auto pr-4 pl-4 items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-tr from-blue-600 to-emerald-500"></div>
          <span className="text-xl font-semibold tracking-tight">Homestead</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/" className="nav-link hover:text-slate-900 transition text-slate-900">Home</Link>
          <Link to="/explore" className="nav-link text-slate-600 hover:text-slate-900 transition">Explore</Link>
          <Link to="/about" className="text-slate-600 hover:text-slate-900 transition">About</Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-slate-700 dark:text-slate-200">Welcome, {user?.name}</span>
              <button onClick={logout} className="hidden sm:inline-flex items-center hover:border-slate-300 hover:bg-slate-50 text-sm font-medium text-slate-700 bg-white border-slate-200 border rounded-md pt-1.5 pr-3 pb-1.5 pl-3">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline-flex items-center hover:border-slate-300 hover:bg-slate-50 text-sm font-medium text-slate-700 bg-white border-slate-200 border rounded-md pt-1.5 pr-3 pb-1.5 pl-3">Login</Link>
              <Link to="/signup" className="inline-flex items-center hover:bg-slate-800 text-sm font-semibold text-white bg-slate-900 rounded-md pt-2 pr-3.5 pb-2 pl-3.5">Sign Up</Link>
            </>
          )}

          <button className="md:hidden inline-flex items-center justify-center rounded-md border border-slate-200 p-2 hover:bg-slate-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-700"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6 lg:px-8">
            <Link to="/" className="text-left rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 text-slate-900">Home</Link>
            <Link to="/explore" className="text-left rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 text-slate-600">Explore</Link>
            <Link to="/about" className="text-left rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">About</Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-left rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Login</Link>
                <Link to="/signup" className="text-left rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;