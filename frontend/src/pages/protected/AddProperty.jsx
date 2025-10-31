import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProperty } from '../../services/hostService';
import axios from 'axios';

const AddProperty = () => {
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
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        const uploadData = new FormData();
        selectedFiles.forEach((file) => {
          uploadData.append('images', file);
        });
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/properties/upload`, uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        imageUrls = uploadRes.data.files;
      }

      const propertyData = { ...formData, images: imageUrls };
      if (propertyData.latitude && propertyData.longitude) {
        propertyData.location = {
          type: 'Point',
          coordinates: [parseFloat(propertyData.longitude), parseFloat(propertyData.latitude)]
        };
        delete propertyData.latitude;
        delete propertyData.longitude;
      }

      await addProperty(propertyData);
      navigate('/dashboard/properties');
    } catch (error) {
      console.error('Failed to add property', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Property Name"
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="p-2 border rounded col-span-2"
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>
        </div>

        {/* Location & Maps */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Location & Maps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="latitude"
              placeholder="Latitude"
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="longitude"
              placeholder="Longitude"
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['WiFi', 'Pool', 'Gym', 'Parking'].map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={amenity}
                  onChange={handleAmenityChange}
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Room Types */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Room Types</h2>
          {formData.roomTypes.map((room, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                name="name"
                placeholder="Room Name"
                value={room.name}
                onChange={(e) => handleRoomTypeChange(index, e)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="beds"
                placeholder="Beds"
                value={room.beds}
                onChange={(e) => handleRoomTypeChange(index, e)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                name="occupancy"
                placeholder="Occupancy"
                value={room.occupancy}
                onChange={(e) => handleRoomTypeChange(index, e)}
                className="p-2 border rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addRoomType}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Add Room Type
          </button>
        </div>

        {/* Pricing & Availability */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Pricing & Availability</h2>
          <input
            type="number"
            name="baseRate"
            placeholder="Base Rate"
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Images & Media */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Images & Media</h2>
          <input type="file" multiple onChange={handleImageChange} className="p-2 border rounded" />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagePreviews.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt="preview" className="w-full h-32 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => {
                    const newSelectedFiles = [...selectedFiles];
                    newSelectedFiles.splice(index, 1);
                    setSelectedFiles(newSelectedFiles);
                    const newImagePreviews = [...imagePreviews];
                    newImagePreviews.splice(index, 1);
                    setImagePreviews(newImagePreviews);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <select name="status" onChange={handleChange} className="p-2 border rounded">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Under Construction">Under Construction</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
