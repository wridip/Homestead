import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHostProperties, deleteProperty } from '../../services/hostService';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(id);
        setProperties(properties.filter((property) => property._id !== id));
      } catch (error) {
        console.error('Failed to delete property', error);
      }
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getHostProperties();
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
    <div className="p-8 bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-neutral-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-200">Manage Properties</h1>
        <Link to="/dashboard/add-property" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Add New Property
        </Link>
      </div>
      <div className="bg-[#1E1E1E] shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-800">
          <thead className="bg-neutral-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#1E1E1E] divide-y divide-neutral-800">
            {properties.map((property) => (
              <tr key={property._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-200">{property.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{property.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{property.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/dashboard/edit-property/${property._id}`} className="text-purple-400 hover:text-purple-300 mr-4">Edit</Link>
                  <button onClick={() => handleDelete(property._id)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProperties;
