import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getHostProperties, deleteProperty } from '../../services/hostService';
import useFetch from '../../hooks/useFetch';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { getImageUrl } from '../../services/api';

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
    return <div className="text-center p-8">Loading properties...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <div className="p-8 bg-background rounded-2xl shadow-lg backdrop-blur-sm border border-border">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight font-serif italic">Manage Properties</h1>
            <p className="text-muted-foreground mt-1">View and manage all your listed properties.</p>
          </div>
          <Link to="/dashboard/add-property" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-5 w-5"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            Add Property
          </Link>
        </div>

        {deleteError && <p className="text-red-500 text-sm mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">{deleteError}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties && properties.map((property) => (
            <div key={property._id} className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={property.images?.length > 0 ? getImageUrl(property.images[0]) : 'https://via.placeholder.com/400x300'} 
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                    property.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    property.status === 'Inactive' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-1 truncate">{property.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin h-3.5 w-3.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {property.address}
                </p>
                
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                  <Link 
                    to={`/dashboard/edit-property/${property._id}`} 
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-accent text-foreground hover:bg-primary hover:text-primary-foreground transition-all font-medium text-sm"
                  >
                    Edit
                  </Link>
                  <Link 
                    to={`/dashboard/properties/${property._id}/photos`} 
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-accent text-foreground hover:bg-primary hover:text-primary-foreground transition-all font-medium text-sm"
                  >
                    Photos
                  </Link>
                  <button 
                    onClick={() => openDeleteDialog(property._id)} 
                    className="col-span-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-medium text-sm border border-red-500/20"
                  >
                    Delete Property
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {properties?.length === 0 && (
            <div className="col-span-full py-20 text-center bg-card rounded-2xl border border-dashed border-border">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home h-8 w-8 text-muted-foreground"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">No properties yet</h3>
              <p className="text-muted-foreground mt-1 mb-6">Start by listing your first property.</p>
              <Link to="/dashboard/add-property" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-5 w-5"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                Add Property
              </Link>
            </div>
          )}
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
