import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Layouts
import MainLayout from '../components/layout/MainLayout.jsx';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileLayout from '../components/layout/ProfileLayout.jsx';

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


const AppRouter = () => {
  return (
    <Router>
      <GoogleMapsLoaderProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute roles={['Host', 'Admin']} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
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
              <Route path="/my-profile" element={<ProfileLayout />}>
                <Route path="About-me" element={<AboutMe />} />
                <Route path="messages" element={<Inbox />} />
                <Route path="bookings" element={<MyBookings />} />
              </Route>
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['Traveler']} />}>
            <Route element={<MainLayout />}>
              <Route path="/share-photo" element={<SharePhoto />} />
            </Route>
          </Route>

          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/host/:id" element={<HostProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
                  </Routes>
                </Suspense>
              </GoogleMapsLoaderProvider>
            </Router>  );
};

export default AppRouter;
