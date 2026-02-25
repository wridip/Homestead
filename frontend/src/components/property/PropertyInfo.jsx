import React from 'react';

const getAmenityIcon = (amenity) => {
  const iconProps = { className: "h-6 w-6 text-[#BB86FC]" };
  const lowerAmenity = amenity.toLowerCase();
  
  if (lowerAmenity.includes('wifi')) {
    return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.345 8.982c5.857-5.858 15.353-5.858 21.21 0" /></svg>;
  }
  if (lowerAmenity.includes('parking')) {
    return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
  }
  if (lowerAmenity.includes('kitchen')) {
    return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
  }
  if (lowerAmenity.includes('bath') || lowerAmenity.includes('toilet')) {
    return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10V6a2 2 0 012-2h14a2 2 0 012 2v4M5 11l1 9a2 2 0 002 2h8a2 2 0 002-2l1-9M5 11h14" /></svg>;
  }
  if (lowerAmenity.includes('tv') || lowerAmenity.includes('television')) {
    return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
  }
  if (lowerAmenity.includes('meal') || lowerAmenity.includes('food')) {
    return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }
  if (lowerAmenity.includes('yoga') || lowerAmenity.includes('spa')) {
    return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
  }
  
  return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
};

const PropertyInfo = ({ description, amenities }) => (
  <div className="md:col-span-2 space-y-12">
    {/* Description Section */}
    <div className="pb-12 border-b border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6 italic">About this homestay</h2>
      <p className="text-neutral-300 leading-relaxed text-lg italic">
        {description}
      </p>
    </div>

    {/* Amenities Section */}
    <div className="pb-12 border-b border-white/10">
      <h2 className="text-2xl font-bold text-white mb-8 italic">What this place offers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-4 py-1">
            {getAmenityIcon(amenity)}
            <span className="text-neutral-300 text-base">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PropertyInfo;
