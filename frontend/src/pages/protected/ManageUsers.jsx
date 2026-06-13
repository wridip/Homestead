import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsers } from '../../services/adminService';
import moment from 'moment';
import { motion } from 'framer-motion';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

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
                    <button className="px-5 py-2 rounded-xl bg-background border border-border text-xs font-bold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm">
                      Audit Profile
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No identities found in this sector</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;