import React, { useState, useEffect } from 'react';
import { getProperties } from '../../services/propertyService';
import { Link } from 'react-router-dom';

const Explore = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        setProperties(response.data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Explore Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link to={`/property/${property._id}`}>
              <img src={property.images[0]} alt={property.name} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{property.name}</h2>
                <p className="text-gray-600">{property.address}</p>
                <p className="text-lg font-bold text-gray-800 mt-2">₹{property.baseRate}/night</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
