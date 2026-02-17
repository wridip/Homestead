import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPropertyById, updateProperty, updatePropertyImages } from '../../services/propertyService';

const getAmenityIcon = (amenity) => {
  switch (amenity) {
    case 'Comfortable beds':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm3-12h.01M3 17h18a2 2 0 002-2V9a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>;
    case 'Wardrobes/closets':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2zM8 7v.01M8 11v.01"></path></svg>;
    case 'Woollen blankets':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 11V7a2 2 0 012-2h.5c.532 0 1.052.126 1.5.368m.5-3.368h-.5C6.948 3 6.428 3.126 6 3.368M4 11v6a2 2 0 002 2h2m-2-8h4m-4 0c-.532 0-1.052.126-1.5.368m.5-3.368h-.5C6.948 3 6.428 3.126 6 3.368M20 11V7a2 2 0 00-2-2h-.5c-.532 0-1.052.126-1.5.368m-.5-3.368h.5c.532 0 1.052.126 1.5.368M20 11v6a2 2 0 01-2 2h-2m2-8h-4m4 0c.532 0 1.052.126 1.5.368m-.5-3.368h.5c-.532 0-1.052-.126-1.5-.368M10 11h4"></path></svg>;
    case 'Attached bathrooms':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 13h10m-3-3V7m-4 6v4m-3-3v4m8-4v4m-3-3h.01M3 21v-4a2 2 0 012-2h14a2 2 0 012 2v4M5 7h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"></path></svg>;
    case 'Hot/cold running water':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>;
    case 'Western-style toilets':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1V3m2 7h-4M5 13h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2zm14 0v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4h18z"></path></svg>;
    case 'Toiletries':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-4.414-4.414A1 1 0 0013.586 4H7a2 2 0 00-2 2v13a2 2 0 002 2z"></path></svg>;
    case 'Free Wi-Fi':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M9.879 16.121a3 3 0 010-4.242m4.242 0a3 3 0 010 4.242M12 12h.01"></path></svg>;
    case 'Televisions with cable/satellite channels':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M12 12h.01"></path></svg>;
    case 'Home-cooked meals':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
    case 'Shared kitchen or kitchenette':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>;
    case 'Housekeeping':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4zM11 4a2 2 0 10-4 0v12a1 1 0 001 1h2a1 1 0 001-1V4zm1-13h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2V5a2 2 0 012-2z"></path></svg>;
    case 'Laundry services':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10M4 20h16"></path></svg>;
    case 'Iron/ironing boards':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10M4 20h16"></path></svg>;
    case 'Personalized guided tours':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
    case 'CCTV surveillance':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.872-3.248A1 1 0 0121 7.279v9.442a1 1 0 01-1.128.927L15 14m0 0l-4 4H9.68l-3.328-3.328C5.972 14.28 5 13.568 5 12.656V11a.5.5 0 01.5-.5h4.872l-1.936-3.226A1 1 0 018.872 7v-.058a1 1 0 011.128-.927L15 10z"></path></svg>;
    case 'Secure parking':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4zm-3-4a1 1 0 011-1h10a1 1 0 011 1v12a1 1 0 01-1 1H7a1 1 0 01-1-1V6zM7 21h10"></path></svg>;
    case 'First-aid kits':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.816A2.003 2.003 0 0015 3.033V3a2 2 0 00-2-2H9a2 2 0 00-2 2v.033A2.003 2.003 0 004.382 8.184l-.304 1.52A4 4 0 007.432 19h9.136a4 4 0 003.354-9.293l-.304-1.52z"></path></svg>;
    case 'Fireplaces':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h2a2 2 0 002-2V9a2 2 0 00-2-2h-3V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a2 2 0 00-2 2v9a2 2 0 002 2h2m0 0V4m0 0H4m16 0v4m0 0h-4M7 7h10"></path></svg>;
    case 'Gardens':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 16v-4m-6-10L4 12m16 0l-2 2m-6-6h.01M12 6.01V6"></path></svg>;
    case 'Terraces':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10M4 20h16"></path></svg>;
    case 'Spa treatments':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3V1h4v6m-4 5h.01M16 16v-4h-4v4h4z"></path></svg>;
    case 'Yoga sessions':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    case 'Flexible check-in/check-out':
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
  }
};

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

const EditProperty = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
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
  const [imagesToDelete, setImagesToDelete] = useState([]); // New state for tracking images to delete
  const [imagePreviews, setImagePreviews] = useState([]); // This will combine existing and new previews
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
        setFormData({
          ...propertyData,
          type: propertyData.type || '', // Ensure type is always set, even if missing from fetched data
        });
        setImagePreviews(propertyData.images || []); // Initialize imagePreviews with existing images
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
    setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevImagePreviews) => [...prevImagePreviews, ...newPreviews]);
  };

  const handleRemoveImage = (imageToRemove) => {
    // Check if the image to remove is a new blob URL or an existing image URL
    if (imageToRemove.startsWith('blob:')) {
      // It's a new image that hasn't been uploaded yet
      setSelectedFiles((prevSelectedFiles) =>
        prevSelectedFiles.filter((file) => URL.createObjectURL(file) !== imageToRemove)
      );
    } else {
      // It's an existing image already uploaded to the server
      setImagesToDelete((prevImagesToDelete) => [...prevImagesToDelete, imageToRemove]);
      setFormData((prevFormData) => ({
        ...prevFormData,
        images: prevFormData.images.filter((image) => image !== imageToRemove),
      }));
    }
    setImagePreviews((prevImagePreviews) =>
      prevImagePreviews.filter((image) => image !== imageToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');

    if (!formData.type) {
      alert('Please select a property type.');
      return;
    }

    try {
      // Step 1: Update text-based property data and handle image deletions
      const propertyData = { ...formData };
      if (propertyData.latitude && propertyData.longitude) {
        propertyData.location = {
          type: 'Point',
          coordinates: [parseFloat(propertyData.longitude), parseFloat(propertyData.latitude)]
        };
        delete propertyData.latitude;
        delete propertyData.longitude;
      }
      // Add imagesToDelete to the propertyData
      propertyData.imagesToDelete = imagesToDelete;
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
            <select
              name="type"
              onChange={handleChange}
              value={formData.type}
              className="p-3 bg-transparent border border-neutral-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 bg-neutral-800"
              required
            >
              <option value="" className="bg-neutral-800 text-white">Select Property Type</option>
              <option value="Mountain" className="bg-neutral-800 text-white">Mountain</option>
              <option value="Riverside" className="bg-neutral-800 text-white">Riverside</option>
              <option value="Farm" className="bg-neutral-800 text-white">Farm</option>
              <option value="Minimal" className="bg-neutral-800 text-white">Minimal</option>
            </select>
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
          <div className="space-y-6">
            {Object.entries(amenityCategories).map(([category, amenities]) => (
              <div key={category}>
                <h3 className="text-xl font-medium text-neutral-300 mb-3">{category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all duration-200
                        ${formData.amenities.includes(amenity)
                          ? 'bg-purple-600 border-purple-600 text-white shadow-lg'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-purple-500'
                        }`}
                      onClick={() => handleAmenityChange({ target: { value: amenity, checked: !formData.amenities.includes(amenity) } })}
                    >
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                      <input
                        type="checkbox"
                        value={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onChange={handleAmenityChange}
                        className="hidden" // Hide the original checkbox
                      />
                    </div>
                  ))}
                </div>
              </div>
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
              <div key={image} className="relative">
                <img 
                  src={image}
                  alt="preview" 
                  className="w-full h-32 object-cover rounded-lg" 
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image)}
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
