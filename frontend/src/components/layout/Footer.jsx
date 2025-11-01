import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.1)] bg-[#121212]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight text-[#E0E0E0]">Homestead</span>
            </Link>
            <p className="mt-2 text-sm text-[#E0E0E0]/70">Authentic homestays in offbeat places, powered by local communities.</p>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" className="inline-flex items-center justify-center rounded-md border border-[rgba(255,255,255,0.1)] p-2 hover:bg-[rgba(255,255,255,0.05)] transition text-[#E0E0E0]" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="inline-flex items-center justify-center rounded-md border border-[rgba(255,255,255,0.1)] p-2 hover:bg-[rgba(255,255,255,0.05)] transition text-[#E0E0E0]" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a href="#" className="inline-flex items-center justify-center rounded-md border border-[rgba(255,255,255,0.1)] p-2 hover:bg-[rgba(255,255,255,0.05)] transition text-[#E0E0E0]" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-tight text-[#E0E0E0]">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#featured" className="text-[#E0E0E0]/80 hover:text-[#E0E0E0] transition">Featured stays</a></li>
              <li><a href="#impact" className="text-[#E0E0E0]/80 hover:text-[#E0E0E0] transition">Impact</a></li>
              <li><a href="#host" className="text-[#E0E0E0]/80 hover:text-[#E0E0E0] transition">Become a host</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-tight text-[#E0E0E0]">Support</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="text-[#E0E0E0]/80 hover:text-[#E0E0E0] transition">Help Center</a></li>
              <li><a href="#" className="text-[#E0E0E0]/80 hover:text-[#E0E0E0] transition">Cancellation options</a></li>
              <li><a href="#" className="text-[#E0E0E0]/80 hover:text-[#E0E0E0] transition">Safety information</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-tight text-[#E0E0E0]">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="text-[#E0E0E0]/80 hover:text-[#E0E0E0] transition">Terms</a></li>
              <li><a href="#" className="text-[#E0E0E0]/80 hover:text-[#E0E0E0] transition">Privacy</a></li>
              <li><a href="#" className="text-[#E0E0E0]/80 hover:text-[#E0E0E0] transition">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[rgba(255,255,255,0.1)] pt-6 text-xs text-[#E0E0E0]/60">
          <p>© {new Date().getFullYear()} Homestead. All rights reserved.</p>
          <div className="inline-flex items-center gap-4">
            <a href="#" className="hover:text-[#E0E0E0] transition">Accessibility</a>
            <a href="#" className="hover:text-[#E0E0E0] transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;