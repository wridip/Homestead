import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../../services/adminService';
import StatCard from '../../components/dashboard/StatCard';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        setStats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Admin Overview...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-foreground">System Administration</h1>
        <p className="text-muted-foreground mt-2">Global oversight of the Homestead platform.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.users.total} 
          change={`${stats.users.new} new this month`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
        />
        <StatCard 
          title="Properties" 
          value={stats.properties.total} 
          change={`${stats.properties.active} active listings`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.bookings.total} 
          change={`${stats.bookings.new} new requests`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>}
        />
        <StatCard 
          title="Platform Revenue" 
          value={`₹${stats.revenue.toLocaleString()}`} 
          change="Lifetime earnings" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-card rounded-3xl border border-border p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 italic">Recent Global Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm uppercase tracking-widest">
                  <th className="pb-4 font-semibold">Traveler</th>
                  <th className="pb-4 font-semibold">Property</th>
                  <th className="pb-4 font-semibold">Amount</th>
                  <th className="pb-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recentBookings.map((booking) => (
                  <tr key={booking._id} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-foreground">{booking.travelerId?.name}</div>
                      <div className="text-xs text-muted-foreground">{booking.travelerId?.email}</div>
                    </td>
                    <td className="py-4 font-medium text-foreground">{booking.propertyId?.name}</td>
                    <td className="py-4 font-bold text-primary">₹{booking.totalPrice}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                        booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-primary/5 rounded-3xl border border-primary/20 p-8">
            <h3 className="text-xl font-bold text-primary mb-4">User Distribution</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Hosts</span>
                <span className="font-bold text-foreground">{stats.users.hosts}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(stats.users.hosts / stats.users.total) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Travelers</span>
                <span className="font-bold text-foreground">{stats.users.travelers}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(stats.users.travelers / stats.users.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;