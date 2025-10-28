import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById } from '../../services/propertyService';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await getPropertyById(id);
        setProperty(response.data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800">{property.name}</h1>
      <p className="text-gray-600">{property.address}</p>
      
      <div className="mt-8">
        <img src={property.images && property.images.length > 0 ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${property.images[0]}` : 'https://via.placeholder.com/300'} alt={property.name} className="w-full object-cover rounded-lg shadow-md" />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">About this property</h2>
        <p className="text-gray-600 mt-4">{property.description}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">Location</h2>
        <div className="mt-4">
          <iframe
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${property.latitude},${property.longitude}`}>
          </iframe>
          <p className="text-sm text-gray-500 mt-2">Note: You need to replace "YOUR_API_KEY" with your own Google Maps API key.</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;