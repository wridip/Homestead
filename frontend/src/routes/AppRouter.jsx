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
import ManagePropertyPhotos from '../pages/protected/ManagePropertyPhotos';
import AddProperty from '../pages/protected/AddProperty';
import EditProperty from '../pages/protected/EditProperty';
import HostBookings from '../pages/protected/HostBookings';
import Profile from '../pages/protected/Profile';
import ProtectedRoute from '../components/common/ProtectedRoute';
import SharePhoto from '../pages/protected/SharePhoto';
import MainLayout from '../components/layout/MainLayout.jsx';

const AppRouter = () => {
  return (
    <Router>
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
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute roles={['Traveler']} />}>
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/share-photo" element={<SharePhoto />} />
        </Route>

        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
