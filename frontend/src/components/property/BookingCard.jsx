import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingCard = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  nights,
  property,
  totalPrice,
  handleBooking,
  bookingError,
  bookingSuccess,
}) => (
  <div className="md:col-span-1">
    <div className="sticky top-24 bg-[#1E1E1E] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-neutral-200 mb-4">Book your stay</h2>
      <DatePicker
        selected={startDate}
        onChange={(dates) => {
          const [start, end] = dates;
          setStartDate(start);
          setEndDate(end);
        }}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        withPortal
        placeholderText="Select your dates"
        className="w-full p-3 bg-neutral-700 text-white rounded-lg"
      />
      {nights > 0 && (
        <div className="mt-4 text-lg text-neutral-200">
          <div className="flex justify-between">
            <span>₹{property.baseRate} x {nights} nights</span>
            <span>₹{(property.baseRate * nights).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t border-neutral-700 mt-2 pt-2">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}
      <button
        onClick={handleBooking}
        className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300"
      >
        Book Now
      </button>
      {bookingError && <p className="text-red-400 mt-2">{bookingError}</p>}
      {bookingSuccess && <p className="text-green-400 mt-2">Booking successful!</p>}
    </div>
  </div>
);

export default BookingCard;
