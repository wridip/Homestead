import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPropertyById, updateProperty, updatePropertyImages } from '../../services/propertyService';

const EditProperty = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    contact: '',
    latitude: '',
    longitude: '',
    amenities: [],
    roomTypes: [],
    baseRate: '',
    seasonalPricing: [],
    images: [],
    status: 'Active',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await getPropertyById(id);
        const propertyData = response.data;
        if (propertyData.location && propertyData.location.coordinates) {
          propertyData.latitude = propertyData.location.coordinates[1];
          propertyData.longitude = propertyData.location.coordinates[0];
        }
        setFormData(propertyData);
        setImagePreviews(propertyData.images || []);
      } catch (error) {
        console.error('Failed to fetch property', error);
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, amenities: [...formData.amenities, value] });
    } else {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((amenity) => amenity !== value),
      });
    }
  };

  const handleRoomTypeChange = (index, e) => {
    const { name, value } = e.target;
    const newRoomTypes = [...formData.roomTypes];
    newRoomTypes[index][name] = value;
    setFormData({ ...formData, roomTypes: newRoomTypes });
  };

  const addRoomType = () => {
    setFormData({
      ...formData,
      roomTypes: [...formData.roomTypes, { name: '', beds: '', occupancy: '' }],
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    // When new files are selected, we only preview the new ones for simplicity.
    // The existing images are already in formData.images.
    setImagePreviews([...formData.images, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const newImagePreviews = [...imagePreviews];
    newImagePreviews.splice(index, 1);
    setImagePreviews(newImagePreviews);

    // This is a simplified removal. It removes from preview but doesn't track complex state.
    // A more robust implementation might be needed for complex edit scenarios.
    // For now, we clear selected files and filter formData images.
    setSelectedFiles([]);
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({...formData, images: newImages});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');
    try {
      // Step 1: Update text-based property data
      const propertyData = { ...formData };
      if (propertyData.latitude && propertyData.longitude) {
        propertyData.location = {
          type: 'Point',
          coordinates: [parseFloat(propertyData.longitude), parseFloat(propertyData.latitude)]
        };
        delete propertyData.latitude;
        delete propertyData.longitude;
      }
      await updateProperty(id, propertyData);

      // Step 2: If there are new images, upload them
      if (selectedFiles.length > 0) {
        const uploadData = new FormData();
        selectedFiles.forEach((file) => {
          uploadData.append('images', file);
        });
        await updatePropertyImages(id, uploadData);
      }

      navigate('/dashboard/properties');
    } catch (error) {
      console.error('Failed to update property', error);
      const errorMessage = error.response ? error.response.data.message : error.message;
      console.error('Error details:', errorMessage);
      alert('An error occurred while updating the property: ' + errorMessage);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-neutral-800">
      <h1 className="text-2xl font-bold text-neutral-200 mb-6">Edit Property</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="p-4 border border-neutral-800 rounded bg-[#1E1E1E]">
          <h2 className="text-xl font-semibold mb-4 text-neutral-200">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Property Name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 bg-transparent border border-neutral-700 rounded text-white"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="p-2 bg-transparent border border-neutral-700 rounded text-white"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="p-2 bg-transparent border border-neutral-700 rounded col-span-2 text-white"
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={formData.contact}
              onChange={handleChange}
              className="p-2 bg-transparent border border-neutral-700 rounded text-white"
            />
          </div>
        </div>

        {/* Location & Maps */}
        <div className="p-4 border border-neutral-800 rounded bg-[#1E1E1E]">
          <h2 className="text-xl font-semibold mb-4 text-neutral-200">Location & Maps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="p-2 bg-transparent border border-neutral-700 rounded text-white"
            />
            <input
              type="text"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="p-2 bg-transparent border border-neutral-700 rounded text-white"
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="p-4 border border-neutral-800 rounded bg-[#1E1E1E]">
          <h2 className="text-xl font-semibold mb-4 text-neutral-200">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['WiFi', 'Pool', 'Gym', 'Parking'].map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2 text-neutral-200">
                <input
                  type="checkbox"
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={handleAmenityChange}
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Room Types */}
        <div className="p-4 border border-neutral-800 rounded bg-[#1E1E1E]">
          <h2 className="text-xl font-semibold mb-4 text-neutral-200">Room Types</h2>
          {formData.roomTypes.map((room, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                name="name"
                placeholder="Room Name"
                value={room.name}
                onChange={(e) => handleRoomTypeChange(index, e)}
                className="p-2 bg-transparent border border-neutral-700 rounded text-white"
              />
              <input
                type="number"
                name="beds"
                placeholder="Beds"
                value={room.beds}
                onChange={(e) => handleRoomTypeChange(index, e)}
                className="p-2 bg-transparent border border-neutral-700 rounded text-white"
              />
              <input
                type="number"
                name="occupancy"
                placeholder="Occupancy"
                value={room.occupancy}
                onChange={(e) => handleRoomTypeChange(index, e)}
                className="p-2 bg-transparent border border-neutral-700 rounded text-white"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addRoomType}
            className="bg-neutral-700 text-white px-4 py-2 rounded"
          >
            Add Room Type
          </button>
        </div>

        {/* Pricing & Availability */}
        <div className="p-4 border border-neutral-800 rounded bg-[#1E1E1E]">
          <h2 className="text-xl font-semibold mb-4 text-neutral-200">Pricing & Availability</h2>
          <input
            type="number"
            name="baseRate"
            placeholder="Base Rate"
            value={formData.baseRate}
            onChange={handleChange}
            className="p-2 bg-transparent border border-neutral-700 rounded text-white"
          />
        </div>

        {/* Images & Media */}
        <div className="p-4 border border-neutral-800 rounded bg-[#1E1E1E]">
          <h2 className="text-xl font-semibold mb-4 text-neutral-200">Images & Media</h2>
          <input type="file" multiple onChange={handleImageChange} className="p-2 bg-transparent border border-neutral-700 rounded text-white" />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagePreviews.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={image}
                  alt="preview" 
                  className="w-full h-32 object-cover rounded-lg" 
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="p-4 border border-neutral-800 rounded bg-[#1E1E1E]">
          <h2 className="text-xl font-semibold mb-4 text-neutral-200">Status</h2>
          <select name="status" value={formData.status} onChange={handleChange} className="p-2 bg-transparent border border-neutral-700 rounded text-white bg-[#1E1E1E]">
            <option value="Active" className="bg-[#1E1E1E] text-white">Active</option>
            <option value="Inactive" className="bg-[#1E1E1E] text-white">Inactive</option>
            <option value="Under Construction" className="bg-[#1E1E1E] text-white">Under Construction</option>
          </select>
        </div>

        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg">
          Update Property
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
