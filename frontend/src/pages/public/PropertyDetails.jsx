import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById } from '../../services/propertyService';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

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

  const center = {
    lat: property.location.coordinates[1],
    lng: property.location.coordinates[0]
  };

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
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '450px' }}
              center={center}
              zoom={15}
            >
              <Marker position={center} />
            </GoogleMap>
          ) : (
            <div>Loading Map...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;