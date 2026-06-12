import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHostBookings, approveBooking, cancelBooking, completeBooking } from '../../services/bookingService';

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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
    setUpdating(null);
  };

  const handleCancel = async (bookingId) => {
    setUpdating(bookingId);
    try {
      await cancelBooking(bookingId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
    setUpdating(null);
  };

  const handleComplete = async (bookingId) => {
    setUpdating(bookingId);
    try {
      await completeBooking(bookingId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
    setUpdating(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8 bg-background rounded-2xl shadow-lg backdrop-blur-sm border border-border">
      <h1 className="text-2xl font-bold text-foreground mb-6">Manage Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-foreground">You have no bookings.</p>
      ) : (
        <div className="bg-card shadow-md rounded-lg overflow-x-auto border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Traveler</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{booking.propertyId?.name || 'Deleted Property'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{booking.travelerId?.name || 'Deleted User'}</td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {booking.status === 'Pending' && (
                      <button
                        onClick={() => handleApprove(booking._id)}
                        disabled={updating === booking._id}
                        className="text-green-500 hover:text-green-600 font-medium disabled:opacity-50"
                      >
                        {updating === booking._id ? 'Approving...' : 'Approve'}
                      </button>
                    )}
                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => handleComplete(booking._id)}
                        disabled={updating === booking._id}
                        className="text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50"
                      >
                        {updating === booking._id ? 'Completing...' : 'Complete'}
                      </button>
                    )}
                    {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={updating === booking._id}
                        className="text-red-500 hover:text-red-600 font-medium ml-4 disabled:opacity-50"
                      >
                        {updating === booking._id ? 'Cancelling...' : 'Cancel'}
                      </button>
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

export default HostBookings;