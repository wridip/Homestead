import React, { useState, useEffect } from 'react';
import { getDashboardStats, getMonthlyEarningsDetail } from '../../services/hostService';
import { Link } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getImageUrl } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/common/Modal';
import moment from 'moment';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-4 rounded-lg border border-border">
        <p className="text-md text-foreground">{label}</p>
        <p className="text-sm text-primary">{`Bookings: ${payload[0].value}`}</p>
        <p className="text-sm text-green-400">{`Revenue: ₹${payload[1].value.toLocaleString()}`}</p>
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
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthDetail, setMonthDetail] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getDashboardStats(dateRange);
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  const handleMonthClick = async (month, year) => {
    setSelectedMonth({ month, year });
    setLoadingDetail(true);
    try {
      const response = await getMonthlyEarningsDetail(year, month);
      setMonthDetail(response.data);
    } catch (err) {
      console.error("Failed to fetch month details", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary animate-pulse"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path><circle cx="12" cy="12" r="10"></circle></svg>
          <span className="text-muted-foreground font-serif italic tracking-widest text-sm">Aggregating records...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">{error}</div>;
  }

  const chartData = stats?.bookingData?.map(d => ({
    name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Bookings: d.bookings,
    Revenue: d.revenue,
  })) || [];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="p-8 bg-background rounded-2xl shadow-lg backdrop-blur-sm border border-border space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground font-serif italic">
            Host Dashboard
          </h1>
          <p className="text-md text-muted-foreground mt-1">
            Real-time performance metrics and guest activity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/dashboard/bookings" className="bg-card p-4 rounded-lg flex items-center gap-4 hover:bg-accent transition-colors border border-border group">
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Manage Bookings</h3>
            <p className="text-sm text-muted-foreground">View and manage all your bookings.</p>
          </div>
        </Link>
        <Link to="/dashboard/messages" className="bg-card p-4 rounded-lg flex items-center gap-4 hover:bg-accent transition-colors border border-border group">
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M4 22v-7l-2-1v-5l2-1V2h16v5l2 1v5l-2 1v7Z"></path><path d="M16 7.5a4 4 0 0 0-8 0"></path></svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">View Messages</h3>
            <p className="text-sm text-muted-foreground">Check your inbox for new messages.</p>
          </div>
        </Link>
        <Link to="/dashboard/properties" className="bg-card p-4 rounded-lg flex items-center gap-4 hover:bg-accent transition-colors border border-border group">
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Manage Properties</h3>
            <p className="text-sm text-muted-foreground">Edit and update your properties.</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Properties" value={stats?.totalProperties} change={`+${stats?.newPropertiesThisMonth} this month`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>} />
        <StatCard title="Total Bookings" value={stats?.totalBookings} change={`+${stats?.bookingGrowth}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg>} />
        <StatCard title="Monthly Earnings" value={`₹${stats?.monthlyEarnings?.toLocaleString() ?? 0}`} change={`+${stats?.earningsGrowth}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground"><circle cx="8" cy="8" r="6"></circle><path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path><path d="M7 6h1v4"></path><path d="m16.71 13.88.7.71-2.82 2.82"></path></svg>} />
        <StatCard title="Occupancy Rate" value={`${stats?.occupancyRate}%`} change={`+${stats?.occupancyRateGrowth}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Bookings & Revenue Overview
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setDateRange('7')} className={`px-3 py-1 rounded-md text-sm ${dateRange === '7' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>7D</button>
              <button onClick={() => setDateRange('30')} className={`px-3 py-1 rounded-md text-sm ${dateRange === '30' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>30D</button>
              <button onClick={() => setDateRange('90')} className={`px-3 py-1 rounded-md text-sm ${dateRange === '90' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>90D</button>
              <button onClick={() => setDateRange('all')} className={`px-3 py-1 rounded-md text-sm ${dateRange === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>All</button>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="Bookings" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="Revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">
            Upcoming Bookings
          </h2>
          <div className="space-y-4">
            {stats?.upcomingBookings.length > 0 ? (
              stats.upcomingBookings.slice(0, 3).map(booking => (
                <div key={booking._id} className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border hover:border-primary transition-colors">
                  <img src={booking.propertyId?.images?.length > 0 ? getImageUrl(booking.propertyId.images[0]) : 'https://via.placeholder.com/150'} className="h-16 w-16 rounded-lg object-cover" alt="property" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {booking.propertyId?.name || 'Deleted Property'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      By {booking.travelerId?.name || 'Deleted User'} ({booking.nights} nights)
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground italic text-sm py-4">No upcoming bookings.</p>
            )}
            <Link to="/dashboard/bookings" className="block w-full text-center text-primary font-semibold hover:underline text-sm">
              View all bookings
            </Link>
          </div>
        </div>
      </div>

      {/* Revenue Audit Section for Host */}
      <div className="bg-card rounded-[2.5rem] border border-border p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3c4.667 0 4.667-7 0-7"/></svg>
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-foreground tracking-tight font-serif italic">Revenue Audit</h2>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">Monthly Breakdown</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
              stats.monthlyRevenue.map((rev, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={`${rev._id.year}-${rev._id.month}`} 
                  onClick={() => handleMonthClick(rev._id.month, rev._id.year)}
                  className="bg-background/50 border border-border p-6 rounded-3xl group hover:border-primary/50 transition-all shadow-sm cursor-pointer"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">{monthNames[rev._id.month - 1]} {rev._id.year}</p>
                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-foreground tracking-tighter">₹{rev.totalRevenue.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">{rev.bookingCount} Stays</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-muted-foreground italic">No completed stays found for revenue audit.</p>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!selectedMonth}
        onClose={() => setSelectedMonth(null)}
        title={`Earnings Audit: ${selectedMonth ? monthNames[selectedMonth.month - 1] : ''} ${selectedMonth?.year}`}
        maxWidth="max-w-6xl"
      >
        <div className="space-y-6">
          {loadingDetail ? (
            <div className="py-20 text-center animate-pulse text-muted-foreground">Extracting ledger entries...</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border scrollbar-hide">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Guest Identity</th>
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Checkout</th>
                    <th className="px-6 py-4 text-right">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {monthDetail.map((booking) => (
                    <tr key={booking._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground text-sm">{booking.travelerId?.name}</div>
                        <div className="text-[10px] text-muted-foreground">{booking.travelerId?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground text-sm">{booking.propertyId?.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[200px]">{booking.propertyId?.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-black text-foreground">{booking.nights + 1} days & {booking.nights} nights</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground font-medium">
                        {moment(booking.endDate).format('MMM D, YYYY')}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-primary text-sm">
                        ₹{booking.totalPrice.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {monthDetail.length === 0 && (
                <div className="p-10 text-center text-muted-foreground italic">No detailed records found.</div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DashboardHome;

