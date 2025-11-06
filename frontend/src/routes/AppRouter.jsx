import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Home from '../pages/public/Home';
import Explore from '../pages/public/Explore';
import PropertyDetails from '../pages/public/PropertyDetails';
import Login from '../pages/public/Login';
import Signup from '../pages/public/Signup';
import MyBookings from '../pages/protected/MyBookings';
import About from '../pages/public/About';
import NotFound from '../pages/public/NotFound';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardHome from '../pages/protected/DashboardHome';
import ManageProperties from '../pages/protected/ManageProperties';
import AddProperty from '../pages/protected/AddProperty';
import EditProperty from '../pages/protected/EditProperty';
import HostBookings from '../pages/protected/HostBookings';
import Profile from '../pages/protected/Profile';
import ProtectedRoute from '../components/common/ProtectedRoute';
import SharePhoto from '../pages/protected/SharePhoto';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute roles={['Host', 'Admin']} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="properties" element={<ManageProperties />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="edit-property/:id" element={<EditProperty />} />
            <Route path="bookings" element={<HostBookings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute roles={['Traveler']} />}>
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/share-photo" element={<SharePhoto />} />
        </Route>

        {/* Public Routes */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
};

const MainLayout = () => (
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
    <Navbar />
    <main className="flex-grow">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default AppRouter;
