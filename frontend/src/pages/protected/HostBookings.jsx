import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHostBookings, approveBooking, cancelBooking, completeBooking } from '../../services/bookingService';
import { motion, AnimatePresence } from 'framer-motion';

const HostBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); // To track which booking is being updated
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getHostBookings();
        setBookings(response.data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchBookings();
  }, []);

  const handleApprove = async (bookingId) => {
    setUpdating(bookingId);
    try {
      await approveBooking(bookingId);
      // Refresh bookings
      const response = await getHostBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err.message);
    }
    setUpdating(null);
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setUpdating(bookingId);
    try {
      await cancelBooking(bookingId);
      // Refresh bookings
      const response = await getHostBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err.message);
    }
    setUpdating(null);
  };

  const handleComplete = async (bookingId) => {
    setUpdating(bookingId);
    try {
      await completeBooking(bookingId);
      // Refresh bookings
      const response = await getHostBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err.message);
    }
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">{error}</div>;
  }

  return (
    <div className="p-8 space-y-12 max-w-[1600px] mx-auto">
      <header className="space-y-1">
        <h1 className="text-5xl font-black text-foreground tracking-tighter font-serif italic">Booking Command</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Reservations & Guest Management</p>
      </header>

      <div className="bg-card rounded-[2.5rem] border border-border p-10 shadow-2xl">
        {bookings.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <p className="text-muted-foreground font-serif italic text-xl">No active reservations found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left">
              <thead>
                <tr className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] border-b border-border">
                  <th className="pb-6 px-4">Property</th>
                  <th className="pb-6 px-4">Traveler</th>
                  <th className="pb-6 px-4">Dates</th>
                  <th className="pb-6 px-4">Status</th>
                  <th className="pb-6 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((booking, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={booking._id} 
                    className="group hover:bg-muted/10 transition-colors"
                  >
                    <td className="py-6 px-4">
                      <div className="font-bold text-foreground text-sm tracking-tight">{booking.propertyId?.name || 'Deleted Property'}</div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="font-bold text-foreground text-sm tracking-tight">{booking.travelerId?.name || 'Deleted User'}</div>
                      <div className="text-[10px] text-muted-foreground font-medium">{booking.travelerId?.email}</div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="text-xs font-black text-foreground">
                        {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        booking.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-6 px-4 text-right space-x-2">
                      <div className="flex justify-end gap-2">
                        {booking.status === 'Pending' && (
                          <button
                            onClick={() => handleApprove(booking._id)}
                            disabled={updating === booking._id}
                            className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors disabled:opacity-50"
                          >
                            {updating === booking._id ? '...' : 'Approve'}
                          </button>
                        )}
                        {booking.status === 'Confirmed' && (
                          <button
                            onClick={() => handleComplete(booking._id)}
                            disabled={updating === booking._id}
                            className="bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors disabled:opacity-50"
                          >
                            {updating === booking._id ? '...' : 'Complete'}
                          </button>
                        )}
                        {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            disabled={updating === booking._id}
                            className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                          >
                            {updating === booking._id ? '...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostBookings;