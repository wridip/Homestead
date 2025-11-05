import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 antialiased font-[Inter]">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.03), rgba(0,0,0,0) 55%) , radial-gradient(120% 120% at 50% 100%, rgba(255,255,255,0.025), rgba(0,0,0,0) 55%), linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.6))',
        }}></div>
        <div className="absolute -top-1/3 -left-1/4 w-[120vw] h-[120vh] blur-3xl opacity-60" style={{
          background:
            'radial-gradient(65% 100% at 30% 40%, rgba(255,255,255,0.06), rgba(255,255,255,0) 60%), radial-gradient(45% 80% at 70% 35%, rgba(255,255,255,0.04), rgba(255,255,255,0) 65%), radial-gradient(40% 70% at 55% 70%, rgba(255,255,255,0.045), rgba(255,255,255,0) 60%)',
          animation: 'driftA 26s ease-in-out infinite alternate',
        }}></div>
        <div className="absolute -bottom-1/3 -right-1/4 w-[120vw] h-[120vh] blur-3xl opacity-50" style={{
          background:
            'radial-gradient(60% 100% at 70% 60%, rgba(255,255,255,0.05), rgba(255,255,255,0) 60%), radial-gradient(40% 70% at 35% 40%, rgba(255,255,255,0.035), rgba(255,255,255,0) 65%), radial-gradient(35% 60% at 45% 75%, rgba(255,255,255,0.035), rgba(255,255,255,0) 60%)',
          animation: 'driftB 28s ease-in-out infinite alternate',
        }}></div>
        <div className="absolute inset-0 blur-2xl opacity-50" style={{
          background:
            'radial-gradient(35% 20% at 50% 55%, rgba(255,255,255,0.05), rgba(255,255,255,0) 70%)',
          animation: 'driftC 24s ease-in-out infinite alternate',
        }}></div>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.35) 85%, rgba(0,0,0,0.6) 100%)',
        }}></div>
      </div>

      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 md:ml-72">
          <Topbar />
          <section className="px-4 md:px-6 py-6 space-y-6">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;