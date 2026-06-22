import React, { useState } from 'react';

import { getAmenityIcon } from '../../utils/amenityIcons';

const PropertyInfo = ({ description, amenities }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="md:col-span-2 space-y-12">
      {/* Description Section */}
      <div className="pb-12 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground mb-6 italic">About this homestay</h2>
        <div className="relative">
          <p className={`text-muted-foreground leading-relaxed text-lg italic transition-all duration-300 ${!isExpanded ? 'line-clamp-4' : ''}`}>
            {description}
          </p>
          {description.length > 280 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 text-primary font-bold text-sm hover:underline flex items-center gap-1 group"
            >
              {isExpanded ? 'Show less' : 'Read more'}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} group-hover:translate-x-0.5`}
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Amenities Section */}
      <div className="pb-12 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground mb-8 italic">What this place offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-4 py-1">
              {getAmenityIcon(amenity)}
              <span className="text-muted-foreground text-base">
                {amenity.includes('|') ? amenity.split('|')[0] : amenity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
