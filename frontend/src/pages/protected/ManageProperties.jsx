import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getHostProperties, deleteProperty } from '../../services/hostService';
import useFetch from '../../hooks/useFetch';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';

const ManageProperties = () => {
  const { data: properties, loading, error, setData: setProperties } = useFetch(getHostProperties);
  const [deleteError, setDeleteError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const openDeleteDialog = (id) => {
    setPropertyToDelete(id);
    setIsDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setPropertyToDelete(null);
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    const originalProperties = [...properties];
    setProperties(properties.filter((property) => property._id !== propertyToDelete));
    
    try {
      await deleteProperty(propertyToDelete);
    } catch (error) {
      setDeleteError('Failed to delete property. Please try again.');
      setProperties(originalProperties);
      console.error('Failed to delete property', error);
    } finally {
      closeDeleteDialog();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="p-8 bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-neutral-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-200">Manage Properties</h1>
          <Link to="/dashboard/add-property" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Add New Property
          </Link>
        </div>
        {deleteError && <p className="text-red-500 text-sm mb-4">{deleteError}</p>}
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
              {properties && properties.map((property) => (
                <tr key={property._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-200">{property.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{property.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{property.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/dashboard/edit-property/${property._id}`} className="text-purple-400 hover:text-purple-300 mr-4">Edit</Link>
                    <Link to={`/dashboard/properties/${property._id}/photos`} className="text-blue-400 hover:text-blue-300 mr-4">Manage Photos</Link>
                    <button onClick={() => openDeleteDialog(property._id)} className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this property? This action cannot be undone."
      />
    </>
  );
};

export default ManageProperties;
