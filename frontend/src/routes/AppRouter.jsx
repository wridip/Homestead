import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from '../components/layout/MainLayout.jsx';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileLayout from '../components/layout/ProfileLayout.jsx';
import PageTransition from '../components/layout/PageTransition.jsx';

// Components
import ProtectedRoute from '../components/common/ProtectedRoute';

// Public Pages
const Home = lazy(() => import('../pages/public/Home'));
const Explore = lazy(() => import('../pages/public/Explore'));
const PropertyDetails = lazy(() => import('../pages/public/PropertyDetails'));
const HostProfile = lazy(() => import('../pages/public/HostProfile'));
const Login = lazy(() => import('../pages/public/Login'));
const Signup = lazy(() => import('../pages/public/Signup'));
const About = lazy(() => import('../pages/public/About'));
const NotFound = lazy(() => import('../pages/public/NotFound'));

// Protected Pages
const DashboardHome = lazy(() => import('../pages/protected/DashboardHome'));
const ManageProperties = lazy(() => import('../pages/protected/ManageProperties'));
const ManagePropertyPhotos = lazy(() => import('../pages/protected/ManagePropertyPhotos'));
const AddProperty = lazy(() => import('../pages/protected/AddProperty'));
const EditProperty = lazy(() => import('../pages/protected/EditProperty'));
const HostBookings = lazy(() => import('../pages/protected/HostBookings'));
const MyBookings = lazy(() => import('../pages/protected/MyBookings'));
const SharePhoto = lazy(() => import('../pages/protected/SharePhoto'));
const EarningsAudit = lazy(() => import('../pages/protected/EarningsAudit'));

// Shared Pages
const Inbox = lazy(() => import('../pages/shared/Inbox'));
const AboutMe = lazy(() => import('../pages/shared/AboutMe'));


import { GoogleMapsLoaderProvider } from '../context/GoogleMapsLoaderContext.jsx';


// Custom Loading Spinner
const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary animate-pulse"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path><circle cx="12" cy="12" r="10"></circle></svg>
      <span className="text-muted-foreground font-serif italic tracking-widest text-sm">Loading...</span>
    </div>
  </div>
);


const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute roles={['Host', 'Admin']} />}>
          <Route path="/dashboard" element={<PageTransition><DashboardLayout /></PageTransition>}>
            <Route index element={<DashboardHome />} />
            <Route path="properties" element={<ManageProperties />} />
            <Route path="properties/:id/photos" element={<ManagePropertyPhotos />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="edit-property/:id" element={<EditProperty />} />
            <Route path="bookings" element={<HostBookings />} />
            <Route path="messages" element={<Inbox />} />
            <Route path="audit" element={<EarningsAudit />} />
            <Route path="profile" element={<AboutMe />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['Traveler', 'Host', 'Admin']} />}>
          <Route element={<MainLayout />}>
            <Route path="/my-profile" element={<PageTransition><ProfileLayout /></PageTransition>}>
              <Route path="About-me" element={<AboutMe />} />
              <Route path="messages" element={<Inbox />} />
              <Route path="bookings" element={<MyBookings />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['Traveler']} />}>
          <Route element={<MainLayout />}>
            <Route path="/share-photo" element={<PageTransition><SharePhoto /></PageTransition>} />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/explore" element={<PageTransition><Explore /></PageTransition>} />
          <Route path="/property/:id" element={<PageTransition><PropertyDetails /></PageTransition>} />
          <Route path="/host/:id" element={<PageTransition><HostProfile /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <GoogleMapsLoaderProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatedRoutes />
        </Suspense>
      </GoogleMapsLoaderProvider>
    </Router>
  );
};

export default AppRouter;
