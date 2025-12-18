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
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-neutral-200">Manage Photos for {property.name}</h1>
      <div className="mt-8">
        <form onSubmit={handleFormSubmit}>
          <div className="mt-4">
            <label htmlFor="images" className="block text-sm font-medium text-neutral-400">
              Upload new images (up to 5)
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagePropertyPhotos;
