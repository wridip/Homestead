import React from 'react';

const GuestSelector = ({ guests, setGuests }) => {
  const handleIncrement = () => {
    setGuests(prevGuests => (prevGuests ? parseInt(prevGuests, 10) + 1 : 1));
  };

  const handleDecrement = () => {
    setGuests(prevGuests => (prevGuests && parseInt(prevGuests, 10) > 1 ? parseInt(prevGuests, 10) - 1 : ""));
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value, 10) > 0)) {
        setGuests(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
        <button
            type="button"
            onClick={handleDecrement}
            className="p-0.5 rounded-full bg-neutral-700 text-white hover:bg-neutral-600 transition"
            aria-label="Decrement guests"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M5 12h14"/></svg>
        </button>
        <input
            type="text"
            placeholder="Guests"
            className="w-full bg-transparent text-sm text-center placeholder-neutral-400 focus:outline-none text-white"
            value={guests}
            onChange={handleChange}
            aria-label="Number of guests"
        />
        <button
            type="button"
            onClick={handleIncrement}
            className="p-0.5 rounded-full bg-neutral-700 text-white hover:bg-neutral-600 transition"
            aria-label="Increment guests"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
    </div>
  );
};

export default GuestSelector;
