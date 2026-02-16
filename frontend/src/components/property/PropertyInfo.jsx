import React from 'react';

const PropertyInfo = ({ description, amenities }) => (
  <div className="md:col-span-2">
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2">
        About this property
      </h2>
      <p className="mt-4 text-neutral-300">{description}</p>
    </div>
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2">
        Amenities
      </h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {amenities.map((amenity, index) => (
          <li key={index} className="flex items-center text-neutral-300">
            <span className="mr-2">✅</span> {amenity}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default PropertyInfo;
