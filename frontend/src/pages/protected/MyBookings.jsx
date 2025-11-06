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
    <div className="container mx-auto px-6 py-12 bg-transparent">
      <h1 className="text-3xl font-bold text-neutral-200 mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-neutral-400">You have no bookings.</p>
      ) : (
        <div className="bg-[#1E1E1E] shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-[#121212]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#1E1E1E] divide-y divide-neutral-800">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-200">{booking.propertyId.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{booking.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {booking.status !== 'Cancelled' && (
                      <button onClick={() => handleCancel(booking._id)} className="text-red-400 hover:text-red-300">Cancel</button>
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