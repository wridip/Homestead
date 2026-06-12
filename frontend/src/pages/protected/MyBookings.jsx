import React, { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking } from '../../services/bookingService';

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8 bg-background rounded-2xl shadow-lg backdrop-blur-sm border border-border">
      <h1 className="text-3xl font-bold text-foreground mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-muted-foreground">You have no bookings.</p>
      ) : (
        <div className="bg-card shadow-md rounded-lg overflow-x-auto border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{booking.propertyId?.name || 'Deleted Property'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-500' :
                      booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                      <button onClick={() => handleCancel(booking._id)} className="text-red-400 hover:text-red-300 transition-colors">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;