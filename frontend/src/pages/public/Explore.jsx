import React, { useState, useEffect } from 'react';
import { getProperties } from '../../services/propertyService';
import { Link } from 'react-router-dom';

const Explore = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for properties..."
          className="w-full px-4 py-2 border rounded-lg"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.map((property) => (
          <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <Link to={`/property/${property._id}`}>
              <img 
                src={property.images && property.images.length > 0 ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${property.images[0]}` : 'https://via.placeholder.com/300'} 
                alt={property.name} 
                className="w-full h-56 object-cover" 
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{property.name}</h2>
                <p className="text-gray-600">{property.address}</p>
                <p className="text-lg font-bold text-gray-800 mt-2">₹{property.baseRate}/night</p>
                <div className="mt-4">
                  <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">View Details</button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;