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
    <div className="p-8 bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-neutral-800">
      <h1 className="text-2xl font-bold text-neutral-200 mb-6">Manage Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-neutral-200">You have no bookings.</p>
      ) : (
        <div className="bg-[#1E1E1E] shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-800">
            <thead className="bg-neutral-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Traveler</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#1E1E1E] divide-y divide-neutral-800">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-200">{booking.propertyId.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{booking.travelerId.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{booking.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                    {booking.status === 'Pending' && (
                      <button
                        onClick={() => handleApprove(booking._id)}
                        disabled={updating === booking._id}
                        className="text-green-500 hover:text-green-700 disabled:opacity-50"
                      >
                        {updating === booking._id ? 'Approving...' : 'Approve'}
                      </button>
                    )}
                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => handleComplete(booking._id)}
                        disabled={updating === booking._id}
                        className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                      >
                        {updating === booking._id ? 'Completing...' : 'Complete'}
                      </button>
                    )}
                    {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={updating === booking._id}
                        className="text-red-500 hover:text-red-700 ml-4 disabled:opacity-50"
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