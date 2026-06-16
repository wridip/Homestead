import React, { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking } from '../../services/bookingService';
import { motion } from 'framer-motion';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      const response = await getUserBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        fetchBookings(); // Refresh bookings after cancellation
      } catch (error) {
        console.error('Failed to cancel booking', error);
      }
    }
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
        <h1 className="text-5xl font-black text-foreground tracking-tighter font-serif italic">My Journeys</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Upcoming & Past Stays</p>
      </header>

      <div className="bg-card rounded-[2.5rem] border border-border p-10 shadow-2xl">
        {bookings.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <p className="text-muted-foreground font-serif italic text-xl">You have no upcoming journeys.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left">
              <thead>
                <tr className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] border-b border-border">
                  <th className="pb-6 px-4">Destination</th>
                  <th className="pb-6 px-4">Period</th>
                  <th className="pb-6 px-4">Status</th>
                  <th className="pb-6 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((booking, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={booking._id} 
                    className="group hover:bg-muted/10 transition-colors"
                  >
                    <td className="py-6 px-4">
                      <div className="font-bold text-foreground text-sm tracking-tight">{booking.propertyId?.name || 'Deleted Property'}</div>
                      <div className="text-[10px] text-muted-foreground font-medium">{booking.propertyId?.address}</div>
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
                    <td className="py-6 px-4 text-right">
                      {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                        <button 
                          onClick={() => handleCancel(booking._id)} 
                          className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                          Cancel
                        </button>
                      )}
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

export default MyBookings;