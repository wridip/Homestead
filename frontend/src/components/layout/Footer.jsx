import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-slate-300 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-xs">© 2025 Homestead Management System. All rights reserved.</p>
        <nav className="flex items-center gap-6 text-xs">
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          <Link to="/contact" className="hover:text-white">Contact Us</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;