import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/hostService';
import { Link } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
        <p className="text-md text-white">{label}</p>
        <p className="text-sm text-purple-400">{`Bookings: ${payload[0].value}`}</p>
        <p className="text-sm text-green-400">{`Revenue: ₹${payload[1].value.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('7');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats(dateRange);
        setStats(response.data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchStats();
  }, [dateRange]);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  const chartData = stats?.bookingData?.map(d => ({
    name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Bookings: d.bookings,
    Revenue: d.revenue,
  })) || [];

  return (
    <div className="p-8 bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-neutral-800 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Host Dashboard
          </h1>
          <p className="text-md text-neutral-400 mt-2">
            Welcome back! Here's a snapshot of your performance.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard/add-property" className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors">
            Add New Property
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/dashboard/bookings" className="bg-neutral-800 p-4 rounded-lg flex items-center gap-4 hover:bg-neutral-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-purple-400"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg>
          <div>
            <h3 className="text-lg font-semibold text-white">Manage Bookings</h3>
            <p className="text-sm text-neutral-400">View and manage all your bookings.</p>
          </div>
        </Link>
        <Link to="/dashboard/messages" className="bg-neutral-800 p-4 rounded-lg flex items-center gap-4 hover:bg-neutral-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-purple-400"><path d="M4 22v-7l-2-1v-5l2-1V2h16v5l2 1v5l-2 1v7Z"></path><path d="M16 7.5a4 4 0 0 0-8 0"></path></svg>
          <div>
            <h3 className="text-lg font-semibold text-white">View Messages</h3>
            <p className="text-sm text-neutral-400">Check your inbox for new messages.</p>
          </div>
        </Link>
        <Link to="/dashboard/properties" className="bg-neutral-800 p-4 rounded-lg flex items-center gap-4 hover:bg-neutral-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-purple-400"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          <div>
            <h3 className="text-lg font-semibold text-white">Manage Properties</h3>
            <p className="text-sm text-neutral-400">Edit and update your properties.</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Properties" value={stats?.totalProperties} change={`+${stats?.newPropertiesThisMonth} this month`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-neutral-400"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>} />
        <StatCard title="Total Bookings" value={stats?.totalBookings} change={`+${stats?.bookingGrowth}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-neutral-400"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg>} />
        <StatCard title="Monthly Earnings" value={`₹${stats?.monthlyEarnings?.toFixed(2) ?? 0}`} change={`+${stats?.earningsGrowth}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-neutral-400"><circle cx="8" cy="8" r="6"></circle><path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path><path d="M7 6h1v4"></path><path d="m16.71 13.88.7.71-2.82 2.82"></path></svg>} />
        <StatCard title="Occupancy Rate" value={`${stats?.occupancyRate}%`} change={`+${stats?.occupancyRateGrowth}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-neutral-400"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl border border-neutral-800 bg-[#1E1E1E] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Bookings & Revenue Overview
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setDateRange('7')} className={`px-3 py-1 rounded-md text-sm ${dateRange === '7' ? 'bg-purple-600 text-white' : 'bg-neutral-700 text-neutral-300'}`}>7D</button>
              <button onClick={() => setDateRange('30')} className={`px-3 py-1 rounded-md text-sm ${dateRange === '30' ? 'bg-purple-600 text-white' : 'bg-neutral-700 text-neutral-300'}`}>30D</button>
              <button onClick={() => setDateRange('90')} className={`px-3 py-1 rounded-md text-sm ${dateRange === '90' ? 'bg-purple-600 text-white' : 'bg-neutral-700 text-neutral-300'}`}>90D</button>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis yAxisId="left" stroke="#9CA3AF" />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="Bookings" stroke="#8B5CF6" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="Revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-[#1E1E1E] p-6">
          <h2 className="text-xl font-semibold tracking-tight text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {stats?.upcomingBookings.slice(0, 3).map(booking => (
              <div key={booking._id} className="flex items-start gap-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 hover:border-purple-500 transition-colors">
                <img src={`http://localhost:5000/${booking.propertyId.images[0]}`} className="h-16 w-16 rounded-lg object-cover" alt="property" />
                <div className="flex-1">
                  <p className="font-semibold text-white">
                    {booking.propertyId.name}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-neutral-300 mt-1">
                    Booked by {booking.travelerId.name} for {booking.nights} nights.
                  </p>
                </div>
              </div>
            ))}
            <Link to="/dashboard/bookings" className="w-full mt-4 text-center text-purple-400 font-semibold hover:underline">
              View all bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

