import React from 'react';

const PropertyHeader = ({ name, address }) => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold text-neutral-200">{name}</h1>
    <p className="text-lg text-neutral-400">{address}</p>
  </div>
);

export default PropertyHeader;
