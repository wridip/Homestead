import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/hostService';
import StatCard from '../../components/dashboard/StatCard';
import UpcomingBookings from '../../components/dashboard/UpcomingBookings';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-4">
          <Link to="/dashboard/add-property" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Add New Property
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Properties" value={stats.totalProperties} />
        <StatCard title="Total Bookings" value={stats.totalBookings} />
        <StatCard title="Monthly Earnings" value={`₹${stats.monthlyEarnings.toFixed(2)}`} />
        <StatCard title="Occupancy Rate" value={`${stats.occupancyRate}%`} />
      </div>

      {/* Upcoming Bookings */}
      <UpcomingBookings bookings={stats.upcomingBookings} />
    </div>
  );
};

export default DashboardHome;