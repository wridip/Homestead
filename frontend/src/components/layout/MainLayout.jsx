import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';

const MainLayout = () => (
  <div className="min-h-screen bg-background text-foreground antialiased font-[Inter]">
    <AnimatedBackground />
    <Navbar />
    <main className="flex-grow pt-16">
        <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
