import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsers, getUserAudit } from '../../services/adminService';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/common/Modal';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userAudit, setUserAudit] = useState(null);
  const [loadingAudit, setLoadingAudit] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAuditClick = async (id) => {
    setSelectedUserId(id);
    setLoadingAudit(true);
    try {
      const response = await getUserAudit(id);
      setUserAudit(response.data);
    } catch (err) {
      console.error("Audit failed", err);
    } finally {
      setLoadingAudit(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    hosts: users.filter(u => u.role === 'Host').length,
    travelers: users.filter(u => u.role === 'Traveler').length,
    admins: users.filter(u => u.role === 'Admin').length
  }), [users]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-3xl">
      <p className="text-red-500 font-bold">Error loading users: {error}</p>
    </div>
  );

  return (
    <div className="p-8 space-y-10 max-w-[1600px] mx-auto">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground tracking-tight font-serif italic">User Registry</h1>
          <p className="text-muted-foreground max-w-md">Global directory of all platform participants. Monitor roles, activity, and growth.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'primary' },
            { label: 'Hosts', value: stats.hosts, color: 'blue' },
            { label: 'Guests', value: stats.travelers, color: 'emerald' },
            { label: 'Admins', value: stats.admins, color: 'purple' }
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border px-6 py-3 rounded-2xl shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-foreground tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-card/50 backdrop-blur-sm border border-border p-4 rounded-[2rem] flex flex-col md:flex-row gap-4 items-center shadow-lg">
        <div className="relative flex-1 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          <input 
            type="text" 
            placeholder="Search by name or email identity..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-background/50 border border-border rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
          />
        </div>
        <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border shrink-0">
          {['All', 'Host', 'Traveler', 'Admin'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                roleFilter === role ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {role === 'Traveler' ? 'Guests' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] border-b border-border">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Privilege Level</th>
                <th className="px-8 py-6">Onboarded</th>
                <th className="px-8 py-6 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={user._id} 
                  className="group hover:bg-muted/10 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border border-border group-hover:scale-110 transition-transform ${
                        user.role === 'Admin' ? 'bg-purple-500/10 text-purple-500' :
                        user.role === 'Host' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-base tracking-tight">{user.name}</div>
                        <div className="text-xs text-muted-foreground font-medium">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      user.role === 'Admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                      user.role === 'Host' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      <span className="w-1 h-1 rounded-full bg-current animate-pulse"></span>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-muted-foreground font-medium">
                    {moment(user.createdAt).format('MMMM D, YYYY')}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleAuditClick(user._id)}
                      className="px-5 py-2 rounded-xl bg-background border border-border text-xs font-bold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm"
                    >
                      Audit Profile
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!selectedUserId}
        onClose={() => { setSelectedUserId(null); setUserAudit(null); }}
        title="Institutional Audit"
        maxWidth="max-w-4xl"
      >
        {loadingAudit ? (
          <div className="py-20 text-center animate-pulse text-muted-foreground">Aggregating behavioral data...</div>
        ) : userAudit && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-muted/30 rounded-3xl border border-border">
              <div className="w-20 h-20 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-black shadow-xl shadow-primary/20">
                {userAudit.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">{userAudit.user.name}</h3>
                <p className="text-muted-foreground font-medium">{userAudit.user.email}</p>
                <div className="flex gap-3 mt-3">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                    {userAudit.user.role}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground px-3 py-1 rounded-full border border-border">
                    ID: {userAudit.user._id.substring(0, 8)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border p-6 rounded-3xl">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Booking Analytics</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Total Bookings</span>
                    <span className="font-black text-foreground">{userAudit.bookings.length}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-4">
                    <span className="text-sm font-medium text-muted-foreground">Gross Spend</span>
                    <span className="font-black text-primary">₹{userAudit.bookings.reduce((acc, b) => acc + b.totalPrice, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border p-6 rounded-3xl">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Asset Portfolio</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Managed Listings</span>
                    <span className="font-black text-foreground">{userAudit.properties.length}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-4">
                    <span className="text-sm font-medium text-muted-foreground">Host Yield</span>
                    <span className="font-black text-emerald-500">₹{userAudit.hostBookings.reduce((acc, b) => b.status === 'Completed' ? acc + b.totalPrice : acc, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Recent Stream</h4>
              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {userAudit.bookings.map(booking => (
                  <div key={booking._id} className="p-4 bg-muted/20 border border-border rounded-2xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div>
                        <div className="text-xs font-bold text-foreground">Stay at {booking.propertyId?.name}</div>
                        <div className="text-[10px] text-muted-foreground">{moment(booking.createdAt).fromNow()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-primary">₹{booking.totalPrice}</div>
                      <div className="text-[8px] font-black uppercase text-muted-foreground">{booking.status}</div>
                    </div>
                  </div>
                ))}
                {userAudit.bookings.length === 0 && (
                  <p className="text-center py-10 text-muted-foreground italic text-sm">No activity recorded in the booking stream.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageUsers;