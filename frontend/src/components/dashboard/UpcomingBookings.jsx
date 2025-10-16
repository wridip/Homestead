import React from 'react';
import moment from 'moment';

const UpcomingBookings = ({ bookings }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Bookings</h3>
      {bookings && bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id} className="border-b last:border-b-0 py-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{booking.propertyId.title}</p>
                  <p className="text-sm text-gray-600">
                    {moment(booking.startDate).format('MMM D')} - {moment(booking.endDate).format('MMM D, YYYY')}
                  </p>
                </div>
                <p className="text-sm font-medium text-green-500">Confirmed</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No upcoming bookings.</p>
      )}
    </div>
  );
};

export default UpcomingBookings;
