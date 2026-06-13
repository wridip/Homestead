import React, { useState, useEffect } from 'react';
import { getAdminStats, getMonthlyRevenueDetail } from '../../services/adminService';
import StatCard from '../../components/dashboard/StatCard';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/common/Modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthDetail, setMonthDetail] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [dateRange, setDateRange] = useState('7');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getAdminStats(dateRange);
        setStats(response.data);
      } catch (err) {
        setError(err.message);
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
      const response = await getMonthlyRevenueDetail(year, month);
      setMonthDetail(response.data);
    } catch (err) {
      console.error("Failed to fetch month details", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  if (loading && !stats) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chartData = stats?.bookingData?.map(d => ({
    name: moment(d.date).format('MMM D'),
    Bookings: d.bookings,
    Revenue: d.revenue,
  })) || [];

  return (
    <div className="p-8 space-y-12 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-foreground tracking-tighter font-serif italic">Global Console</h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Strategic Oversight & Revenue Audit</p>
        </div>
        
        <div className="flex bg-muted p-1 rounded-xl border border-border self-start md:self-center shadow-inner">
          {[
            { label: '7D', value: '7' },
            { label: '30D', value: '30' },
            { label: '90D', value: '90' },
            { label: 'All', value: 'all' }
          ].map(range => (
            <button
              key={range.value}
              onClick={() => setDateRange(range.value)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                dateRange === range.value ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="User Base" 
          value={stats.users.total} 
          change={`+${stats.users.new} this month`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
        />
        <StatCard 
          title="Active Inventory" 
          value={stats.properties.active} 
          change={`${stats.properties.total} total listings`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
        />
        <StatCard 
          title="Platform Yield" 
          value={`₹${stats.revenue.toLocaleString()}`} 
          change="Lifetime earnings" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
        />
        <StatCard 
          title="Success Rate" 
          value={`${stats.bookings.total > 0 ? ((stats.bookings.completed / stats.bookings.total) * 100).toFixed(0) : 0}%`} 
          change={`${stats.bookings.completed} completed stays`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
        />
      </div>

      {/* Global Performance Graph */}
      <div className="bg-card rounded-[2.5rem] border border-border p-10 shadow-2xl space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-foreground tracking-tight font-serif italic text-primary">System-Wide Performance</h2>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div> Bookings</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Revenue</div>
          </div>
        </div>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))', fontSize: '12px' }} 
              />
              <Line yAxisId="left" type="monotone" dataKey="Bookings" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="Revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: '#10B981' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Audit Section */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-card rounded-[2.5rem] border border-border p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-foreground tracking-tight font-serif italic">Revenue Audit</h2>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">Monthly Breakdown</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.monthlyRevenue && stats.monthlyRevenue.map((rev, idx) => (
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
                ))}
              </div>
            </div>
          </div>
          
          <Modal
            isOpen={!!selectedMonth}
            onClose={() => setSelectedMonth(null)}
            title={`Audit: ${selectedMonth ? monthNames[selectedMonth.month - 1] : ''} ${selectedMonth?.year}`}
            maxWidth="max-w-6xl"
          >
            <div className="space-y-6">
              {loadingDetail ? (
                <div className="py-20 text-center animate-pulse text-muted-foreground">Extracting ledger entries...</div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-border">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-6 py-4">Guest Identity</th>
                        <th className="px-6 py-4">Asset Performance</th>
                        <th className="px-6 py-4">Duration</th>
                        <th className="px-6 py-4">Checkout</th>
                        <th className="px-6 py-4 text-right">Yield</th>
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
                            <div className="text-xs font-black text-foreground">{booking.nights} nights</div>
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

          {/* Recent Global Activity */}
          <div className="bg-card rounded-[2.5rem] border border-border p-10 shadow-2xl">
            <h2 className="text-3xl font-black text-foreground tracking-tight font-serif italic mb-8">Stream Audit</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] border-b border-border">
                    <th className="pb-6 px-4">Entity</th>
                    <th className="pb-6 px-4">Asset</th>
                    <th className="pb-6 px-4">Value</th>
                    <th className="pb-6 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.recentBookings.map((booking, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.05) }}
                      key={booking._id} 
                      className="group hover:bg-muted/10 transition-colors"
                    >
                      <td className="py-6 px-4">
                        <div className="font-bold text-foreground text-sm tracking-tight">{booking.travelerId?.name}</div>
                        <div className="text-[10px] text-muted-foreground font-medium">{booking.travelerId?.email}</div>
                      </td>
                      <td className="py-6 px-4 font-bold text-foreground text-sm">{booking.propertyId?.name}</td>
                      <td className="py-6 px-4 font-black text-primary text-sm tracking-tighter">₹{booking.totalPrice.toLocaleString()}</td>
                      <td className="py-6 px-4 text-right">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          booking.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User Distribution Sidebar */}
        <div className="space-y-8">
          <div className="bg-primary/5 rounded-[2.5rem] border border-primary/20 p-10 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
            </div>
            <h3 className="text-2xl font-black text-primary tracking-tight font-serif italic mb-8">Demographics</h3>
            <div className="space-y-8">
              {[
                { label: 'Hosts', count: stats.users.hosts, total: stats.users.total, color: 'bg-primary' },
                { label: 'Travelers', count: stats.users.travelers, total: stats.users.total, color: 'bg-emerald-500' }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                    <span className="font-black text-foreground text-lg tracking-tighter">{stats.users.total > 0 ? ((item.count / item.total) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.users.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`${item.color} h-full rounded-full`}
                    ></motion.div>
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground text-right">{item.count} total accounts</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Admin Notification</p>
            <div className="p-4 bg-muted/30 rounded-2xl border border-border">
              <p className="text-xs text-foreground font-medium leading-relaxed italic">"System audit for {monthNames[new Date().getMonth()]} is pending review. Ensure all manual payouts are cleared."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;