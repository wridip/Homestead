import React from 'react';
import { useParams } from 'react-router-dom';

const PropertyDetails = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800">Property Details for ID: {id}</h1>
      {/* Property images, description, booking form, and reviews will go here */}
    </div>
  );
};

export default PropertyDetails;