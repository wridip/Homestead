import React, { useState } from 'react';
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
}) => {
  const [guests, setGuests] = useState(1);

  const handleIncrement = () => {
    setGuests(prev => (prev < 10 ? prev + 1 : prev));
  };

  const handleDecrement = () => {
    setGuests(prev => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className="w-full">
      <div className="sticky top-24 bg-card p-6 rounded-3xl border border-border shadow-2xl space-y-6">
        {/* Header with Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">₹{property.baseRate}</span>
            <span className="text-muted-foreground text-sm">night</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span className="text-foreground">{property.averageRating > 0 ? property.averageRating.toFixed(1) : 'New'}</span>
            {property.numReviews > 0 && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground underline">{property.numReviews} reviews</span>
              </>
            )}
          </div>
        </div>

        {/* Date Selection Box */}
        <div className="border border-border rounded-xl overflow-hidden bg-background/50">
          <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
            <div className="p-3">
              <label className="block text-[10px] font-bold text-primary uppercase mb-1">Check-in</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                placeholderText="Add date"
                className="w-full bg-transparent text-sm text-foreground outline-none cursor-pointer placeholder-muted-foreground/50"
              />
            </div>
            <div className="p-3">
              <label className="block text-[10px] font-bold text-primary uppercase mb-1">Checkout</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                placeholderText="Add date"
                className="w-full bg-transparent text-sm text-foreground outline-none cursor-pointer placeholder-muted-foreground/50"
              />
            </div>
          </div>
          
          <div className="p-3 flex items-center justify-between">
            <div>
              <label className="block text-[10px] font-bold text-primary uppercase mb-1">Guests</label>
              <span className="text-sm text-foreground">{guests} {guests > 1 ? 'guests' : 'guest'}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={guests <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-foreground hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={guests >= 10}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-foreground hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleBooking}
          className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-lg shadow-primary/20 text-lg active:scale-[0.98]"
        >
          {nights > 0 ? 'Reserve' : 'Check availability'}
        </button>

        {/* Feedback Messages */}
        {bookingError && <p className="text-destructive text-xs text-center font-medium">{bookingError}</p>}
        {bookingSuccess && <p className="text-emerald-500 text-xs text-center font-medium">Booking successful!</p>}

        <p className="text-center text-xs text-muted-foreground font-medium">You won't be charged yet</p>

        {/* Price Breakdown */}
        {nights > 0 && (
          <div className="space-y-4 pt-4 border-t border-border text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span className="underline">₹{property.baseRate} x {nights} nights</span>
              <span>₹{(property.baseRate * nights).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-foreground text-lg pt-4 border-t border-border">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
