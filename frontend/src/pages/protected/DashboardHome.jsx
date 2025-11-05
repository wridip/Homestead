import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/hostService';
import { Link } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';

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
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            Host Dashboard
          </h1>
          <p className="text-[14px] text-neutral-400 mt-1">
            Manage properties, bookings, and monitor performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Properties" value={stats?.totalProperties} change={`+${stats?.newPropertiesThisMonth} this month`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-neutral-400"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>} />
        <StatCard title="Total Bookings" value={stats?.totalBookings} change={`+${stats?.bookingGrowth}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-neutral-400"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg>} />
        <StatCard title="Monthly Earnings" value={`₹${stats?.monthlyEarnings?.toFixed(2) ?? 0}`} change={`+${stats?.earningsGrowth}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-neutral-400"><circle cx="8" cy="8" r="6"></circle><path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path><path d="M7 6h1v4"></path><path d="m16.71 13.88.7.71-2.82 2.82"></path></svg>} />
        <StatCard title="Occupancy Rate" value={`${stats?.occupancyRate}%`} change={`+${stats?.occupancyRateGrowth}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-neutral-400"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Bookings & Revenue
              </h2>
              <p className="text-[13px] text-neutral-400 mt-0.5">
                Last 12 weeks
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative h-64">
              {/* Chart will be rendered here once dependencies are installed */}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Incoming Requests
          </h2>
          <p className="text-[13px] text-neutral-400 mt-0.5">Action needed</p>
          <div className="mt-4 space-y-3">
            {stats?.upcomingBookings.slice(0, 2).map(booking => (
              <div key={booking._id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/10">
                <img src={booking.propertyId.images[0]} className="h-10 w-10 rounded-md object-cover" alt="property" />
                <div className="flex-1">
                  <p className="text-[14px] font-medium">
                    {booking.propertyId.name} • {booking.nights} nights
                  </p>
                  <p className="text-[12px] text-neutral-400">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()} • by {booking.travelerId.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-white/10 hover:bg-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-neutral-300"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                  </button>
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-emerald-600/90 hover:bg-emerald-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-white"><path d="M20 6 9 17l-5-5"></path></svg>
                  </button>
                </div>
              </div>
            ))}
            <Link to="/dashboard/bookings" className="w-full mt-2 text-[13px] px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 block text-center">
              View all
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
