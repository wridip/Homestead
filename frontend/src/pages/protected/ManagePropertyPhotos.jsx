import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, updatePropertyImages } from '../../services/propertyService';

const ManagePropertyPhotos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

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

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      await updatePropertyImages(id, formData);
      navigate(`/property/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while uploading images.');
    }
    setUploading(false);
  };

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
    <div className="p-8 bg-background rounded-2xl shadow-lg backdrop-blur-sm border border-border">
      <h1 className="text-3xl font-bold text-foreground">Manage Photos for {property.name}</h1>
      <div className="mt-8 bg-card p-6 rounded-xl border border-border">
        <form onSubmit={handleFormSubmit}>
          <div className="mt-4">
            <label htmlFor="images" className="block text-sm font-medium text-muted-foreground">
              Upload new images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
            />
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagePropertyPhotos;
