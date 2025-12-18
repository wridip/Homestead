import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#1E1E1E] shadow-sm" data-animate>
      <div className="relative">
        <img src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/300'} alt={property.name} className="h-56 w-full object-cover transition duration-300 group-hover:scale-105" />
        {property.isEcoFriendly && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-[#BB86FC]/10 text-[#BB86FC]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
            Eco+ Certified
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight text-[#E0E0E0]">{property.name}</h3>
          <div className="inline-flex items-center gap-1 text-xs font-medium text-[#E0E0E0]/80">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-amber-400"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
            {property.averageRating}
          </div>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-[#E0E0E0]/70">{property.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#E0E0E0]">₹{property.baseRate}<span className="ml-1 font-normal text-[#E0E0E0]/70">/night</span></p>
          <Link to={`/property/${property._id}`} className="btn-adaptive rounded-md px-3 py-1.5 text-sm font-semibold border text-[#121212] bg-[#BB86FC] border-[#BB86FC] hover:bg-opacity-80">View Details</Link>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
