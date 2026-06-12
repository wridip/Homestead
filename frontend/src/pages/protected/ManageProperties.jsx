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
      <div className="p-8 bg-background rounded-2xl shadow-lg backdrop-blur-sm border border-border">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Manage Properties</h1>
          <Link to="/dashboard/add-property" className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            Add New Property
          </Link>
        </div>
        {deleteError && <p className="text-red-500 text-sm mb-4">{deleteError}</p>}
        <div className="bg-card shadow-md rounded-lg overflow-x-auto border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {properties && properties.map((property) => (
                <tr key={property._id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{property.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{property.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      property.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                      property.status === 'Inactive' ? 'bg-red-500/10 text-red-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/dashboard/edit-property/${property._id}`} className="text-primary hover:text-primary/80 mr-4">Edit</Link>
                    <Link to={`/dashboard/properties/${property._id}/photos`} className="text-blue-400 hover:text-blue-300 mr-4">Manage Photos</Link>
                    <button onClick={() => openDeleteDialog(property._id)} className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
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
