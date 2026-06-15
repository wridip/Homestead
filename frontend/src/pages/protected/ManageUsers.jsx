import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsers, getUserAudit } from '../../services/adminService';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/common/Modal';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

  const exportToExcel = () => {
    if (!userAudit) return;
    const { user, travelerStats, hostStats, bookings, properties } = userAudit;

    const workbook = XLSX.utils.book_new();
    
    // User Profile Sheet
    const profileData = [
      ["Institution Profile Audit"],
      ["Name", user.name],
      ["Email", user.email],
      ["Role", user.role],
      ["Onboarded", moment(user.createdAt).format('LL')],
      ["System ID", user._id],
      [],
      ["Economic Performance Metrics"],
      ["Total Stays", travelerStats.totalBookings],
      ["Gross Spend", `₹${travelerStats.totalSpend}`],
      ["Avg Booking Value", `₹${travelerStats.avgBookingValue}`],
      ["Managed Properties", hostStats.totalProperties],
      ["Host Lifetime Yield", `₹${hostStats.totalHostEarnings}`]
    ];
    const profileSheet = XLSX.utils.aoa_to_sheet(profileData);
    XLSX.utils.book_append_sheet(workbook, profileSheet, "Profile Summary");

    // Bookings Sheet
    const bookingsData = bookings.map(b => ({
      "Property": b.propertyId?.name,
      "Address": b.propertyId?.address,
      "Checkout Date": moment(b.endDate).format('YYYY-MM-DD'),
      "Nights": b.nights,
      "Total Price": b.totalPrice,
      "Status": b.status
    }));
    const bookingsSheet = XLSX.utils.json_to_sheet(bookingsData);
    XLSX.utils.book_append_sheet(workbook, bookingsSheet, "Booking Stream");

    XLSX.writeFile(workbook, `Homestead_Audit_${user.name.replace(' ', '_')}.xlsx`);
  };

  const exportToPDF = () => {
    if (!userAudit) return;
    const { user, travelerStats, hostStats, bookings } = userAudit;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.text("Homestead Institutional Audit", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${moment().format('LLLL')}`, 14, 28);

    // Profile Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Identity Dossier", 14, 45);
    doc.autoTable({
      startY: 50,
      body: [
        ["Full Identity", user.name],
        ["Communication", user.email],
        ["Platform Role", user.role],
        ["Onboarding Date", moment(user.createdAt).format('LL')],
        ["System Reference", user._id]
      ],
      theme: 'plain',
      styles: { fontSize: 10 }
    });

    // Economics Section
    doc.text("Economic Indicators", 14, doc.lastAutoTable.finalY + 15);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      body: [
        ["Guest Loyalty (Total Stays)", travelerStats.totalBookings],
        ["Financial Contribution", `INR ${travelerStats.totalSpend.toLocaleString()}`],
        ["Asset Yield", `INR ${hostStats.totalHostEarnings.toLocaleString()}`],
        ["Active Listings", hostStats.totalActiveListings]
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Booking Ledger
    doc.text("Historical Booking Ledger", 14, doc.lastAutoTable.finalY + 15);
    const tableData = bookings.map(b => [
      b.propertyId?.name,
      moment(b.endDate).format('MMM D, YYYY'),
      b.nights,
      `INR ${b.totalPrice.toLocaleString()}`,
      b.status
    ]);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Asset", "Date", "Stay", "Yield", "State"]],
      body: tableData,
      styles: { fontSize: 8 }
    });

    doc.save(`Audit_Statement_${user.name.replace(' ', '_')}.pdf`);
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
        title="Institutional Audit Dossier"
        maxWidth="max-w-5xl"
      >
        {loadingAudit ? (
          <div className="py-20 text-center animate-pulse text-muted-foreground">Aggregating behavioral data streams...</div>
        ) : userAudit && (
          <div className="space-y-10">
            {/* Header with Export */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 p-6 lg:p-8 bg-card rounded-[2.5rem] border border-border shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full lg:w-auto text-center sm:text-left">
                <div className="w-20 h-20 shrink-0 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center text-3xl font-black shadow-inner border border-primary/20">
                  {userAudit.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground font-serif italic tracking-tight">{userAudit.user.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{userAudit.user.email}</p>
                  <div className="flex justify-center sm:justify-start gap-3 pt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-muted text-muted-foreground px-3 py-1 rounded-lg border border-border">
                      {userAudit.user.role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 shrink-0">
                <button 
                  onClick={exportToExcel}
                  className="flex-1 flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-background border border-border text-xs font-black uppercase tracking-widest text-foreground hover:bg-muted transition-all shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                  Export XLSX
                </button>
                <button 
                  onClick={exportToPDF}
                  className="flex-1 flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                  Export PDF
                </button>
              </div>
            </div>

            {/* In-depth Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border p-8 rounded-[2rem] space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Booking Intensity</p>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-foreground tracking-tighter">{userAudit.travelerStats.totalBookings}</p>
                  <p className="text-[10px] font-bold text-primary uppercase">Lifetime Reservations</p>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Completion Rate</span>
                  <span className="font-bold text-foreground">{((userAudit.travelerStats.completedBookings / userAudit.travelerStats.totalBookings || 0) * 100).toFixed(0)}%</span>
                </div>
              </div>
              
              <div className="bg-card border border-border p-8 rounded-[2rem] space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Financial Flow</p>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-foreground tracking-tighter">₹{userAudit.travelerStats.totalSpend.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase">Gross Platform Contribution</p>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Avg Ticket</span>
                  <span className="font-bold text-foreground">₹{userAudit.travelerStats.avgBookingValue}</span>
                </div>
              </div>

              <div className="bg-card border border-border p-8 rounded-[2rem] space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Asset Portfolio</p>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-foreground tracking-tighter">₹{userAudit.hostStats.totalHostEarnings.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-blue-500 uppercase">Realized Host Yield</p>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Active Units</span>
                  <span className="font-bold text-foreground">{userAudit.hostStats.totalActiveListings} / {userAudit.hostStats.totalProperties}</span>
                </div>
              </div>
            </div>

            {/* Comprehensive Stream */}
            <div className="space-y-6">
              <h4 className="text-xl font-black text-foreground font-serif italic flex items-center gap-3">
                Transaction Ledger
                <span className="h-px bg-border flex-1"></span>
              </h4>
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {userAudit.bookings.map(booking => (
                  <div key={booking._id} className="group p-6 bg-muted/20 border border-border rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        booking.status === 'Completed' ? 'bg-emerald-500' :
                        booking.status === 'Cancelled' ? 'bg-red-500' :
                        'bg-blue-500'
                      } shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></div>
                      <div>
                        <div className="text-sm font-black text-foreground">Stay at {booking.propertyId?.name}</div>
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{moment(booking.createdAt).format('MMMM D, YYYY')} • {booking.nights} Nights</div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-border">
                      <div className="text-lg font-black text-primary tracking-tighter font-serif italic">₹{booking.totalPrice.toLocaleString()}</div>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${
                        booking.status === 'Completed' ? 'text-emerald-500' :
                        booking.status === 'Cancelled' ? 'text-red-500' :
                        'text-blue-500'
                      }`}>{booking.status}</div>
                    </div>
                  </div>
                ))}
                {userAudit.bookings.length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-border rounded-[2.5rem]">
                    <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">No historical data points detected</p>
                  </div>
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