import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProperty } from '../../services/hostService';
import axios from 'axios';

const amenityCategories = {
  "Accommodation Comforts": ["Comfortable beds", "Wardrobes/closets", "Woollen blankets"],
  "Essential Facilities": ["Attached bathrooms", "Hot/cold running water", "Western-style toilets", "Toiletries"],
  "Connectivity & Entertainment": ["Free Wi-Fi", "Televisions with cable/satellite channels"],
  "Dining & Kitchen": ["Home-cooked meals", "Shared kitchen or kitchenette"],
  "Guest Services": ["Housekeeping", "Laundry services", "Iron/ironing boards", "Personalized guided tours"],
  "Safety & Security": ["CCTV surveillance", "Secure parking", "First-aid kits"],
  "Unique Touches": ["Fireplaces", "Gardens", "Terraces", "Spa treatments", "Yoga sessions"],
  "Flexibility": ["Flexible check-in/check-out"],
};

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
    <div className="container mx-auto p-8 bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-neutral-800">
      <h1 className="text-3xl font-bold text-neutral-200 mb-8">Add New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="p-6 border border-neutral-800 rounded-lg bg-[#1E1E1E]">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-200">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Property Name"
              onChange={handleChange}
              className="p-3 bg-transparent border border-neutral-700 rounded-md text-white focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className="p-3 bg-transparent border border-neutral-700 rounded-md text-white focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="p-3 bg-transparent border border-neutral-700 rounded-md col-span-2 text-white h-32 resize-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              onChange={handleChange}
              className="p-3 bg-transparent border border-neutral-700 rounded-md text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Location & Maps */}
        <div className="p-6 border border-neutral-800 rounded-lg bg-[#1E1E1E]">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-200">Location & Maps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="latitude"
              placeholder="Latitude"
              onChange={handleChange}
              className="p-3 bg-transparent border border-neutral-700 rounded-md text-white focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="longitude"
              placeholder="Longitude"
              onChange={handleChange}
              className="p-3 bg-transparent border border-neutral-700 rounded-md text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="p-6 border border-neutral-800 rounded-lg bg-[#1E1E1E]">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-200">Amenities</h2>
          <div className="space-y-6">
            {Object.entries(amenityCategories).map(([category, amenities]) => (
              <div key={category}>
                <h3 className="text-xl font-medium text-neutral-300 mb-3">{category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {amenities.map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-3 text-neutral-200 cursor-pointer">
                      <input
                        type="checkbox"
                        value={amenity}
                        onChange={handleAmenityChange}
                        className="h-5 w-5 rounded bg-neutral-700 border-neutral-600 text-purple-600 focus:ring-purple-500"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Types */}
        <div className="p-6 border border-neutral-800 rounded-lg bg-[#1E1E1E]">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-200">Room Types</h2>
          {formData.roomTypes.map((room, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                name="name"
                placeholder="Room Name"
                value={room.name}
                onChange={(e) => handleRoomTypeChange(index, e)}
                className="p-3 bg-transparent border border-neutral-700 rounded-md text-white focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                name="beds"
                placeholder="Number of Beds"
                value={room.beds}
                onChange={(e) => handleRoomTypeChange(index, e)}
                className="p-3 bg-transparent border border-neutral-700 rounded-md text-white focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                name="occupancy"
                placeholder="Max Occupancy"
                value={room.occupancy}
                onChange={(e) => handleRoomTypeChange(index, e)}
                className="p-3 bg-transparent border border-neutral-700 rounded-md text-white focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addRoomType}
            className="bg-neutral-700 text-white px-5 py-2 rounded-md hover:bg-neutral-600 transition-colors"
          >
            Add Room Type
          </button>
        </div>

        {/* Pricing & Availability */}
        <div className="p-6 border border-neutral-800 rounded-lg bg-[#1E1E1E]">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-200">Pricing & Availability</h2>
          <input
            type="number"
            name="baseRate"
            placeholder="Base Rate per Night"
            onChange={handleChange}
            className="p-3 bg-transparent border border-neutral-700 rounded-md text-white w-full md:w-1/2 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Images & Media */}
        <div className="p-6 border border-neutral-800 rounded-lg bg-[#1E1E1E]">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-200">Images & Media</h2>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="p-3 bg-transparent border border-neutral-700 rounded-md text-white w-full"
          />
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagePreviews.map((image, index) => (
              <div key={index} className="relative group">
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
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="p-6 border border-neutral-800 rounded-lg bg-[#1E1E1E]">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-200">Status</h2>
          <select
            name="status"
            onChange={handleChange}
            className="p-3 bg-transparent border border-neutral-700 rounded-md text-white w-full md:w-1/2 focus:ring-2 focus:ring-purple-500 bg-neutral-800"
          >
            <option value="Active" className="bg-neutral-800 text-white">Active</option>
            <option value="Inactive" className="bg-neutral-800 text-white">Inactive</option>
            <option value="Under Construction" className="bg-neutral-800 text-white">Under Construction</option>
          </select>
        </div>

        <button type="submit" className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors">
          Submit Property
        </button>
      </form>
    </div>
  );
};

export default AddProperty;

