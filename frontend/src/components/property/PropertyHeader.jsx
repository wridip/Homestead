import React from 'react';

const PropertyHeader = ({ name, address, rating = 0, reviewsCount = 0 }) => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-white mb-2">{name}</h1>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#BB86FC" stroke="#BB86FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span className="font-bold text-white">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
        </div>
        {reviewsCount > 0 && (
          <>
            <span className="text-neutral-500">·</span>
            <button className="underline font-semibold text-white hover:text-[#BB86FC] transition-colors">{reviewsCount} reviews</button>
          </>
        )}
        <span className="text-neutral-500">·</span>
        <span className="text-white font-medium">{address}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: name, url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard');
            }
          }}
          className="flex items-center gap-2 text-sm font-semibold text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          <span className="underline">Share</span>
        </button>
        <button className="flex items-center gap-2 text-sm font-semibold text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:fill-[#BB86FC] group-hover:stroke-[#BB86FC] transition-all"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
          <span className="underline">Save</span>
        </button>
      </div>
    </div>
  </div>
);

export default PropertyHeader;
