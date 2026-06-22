import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProperty } from '../../services/hostService';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import LocationPicker from '../../components/property/LocationPicker';

const getAmenityIcon = (amenity) => {
  const iconProps = { className: "h-5 w-5 text-primary" };
  switch (amenity) {
    case 'Comfortable beds':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm3-12h.01M3 17h18a2 2 0 002-2V9a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>;
    case 'Wardrobes/closets':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2zM8 7v.01M8 11v.01"></path></svg>;
    case 'Woollen blankets':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 11V7a2 2 0 012-2h.5c.532 0 1.052.126 1.5.368m.5-3.368h-.5C6.948 3 6.428 3.126 6 3.368M4 11v6a2 2 0 002 2h2m-2-8h4m-4 0c-.532 0-1.052.126-1.5.368m.5-3.368h-.5C6.948 3 6.428 3.126 6 3.368M20 11V7a2 2 0 00-2-2h-.5c-.532 0-1.052.126-1.5.368m-.5-3.368h.5c.532 0 1.052.126 1.5.368M20 11v6a2 2 0 01-2 2h-2m2-8h-4m4 0c.532 0 1.052.126 1.5.368m-.5-3.368h.5c-.532 0-1.052-.126-1.5-.368M10 11h4"></path></svg>;
    case 'Attached bathrooms':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 13h10m-3-3V7m-4 6v4m-3-3v4m8-4v4m-3-3h.01M3 21v-4a2 2 0 012-2h14a2 2 0 012 2v4M5 7h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"></path></svg>;
    case 'Hot/cold running water':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>;
    case 'Western-style toilets':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1V3m2 7h-4M5 13h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2zm14 0v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4h18z"></path></svg>;
    case 'Toiletries':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-4.414-4.414A1 1 0 0013.586 4H7a2 2 0 00-2 2v13a2 2 0 002 2z"></path></svg>;
    case 'Free Wi-Fi':
    case 'High-Speed Internet':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M9.879 16.121a3 3 0 010-4.242m4.242 0a3 3 0 010 4.242M12 12h.01"></path></svg>;
    case 'Air Conditioning':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
    case 'Heating':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343a7.99 7.99 0 012.344 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14l.879 2.121z" /></svg>;
    case 'Dedicated Workspace':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
    case 'Televisions with cable/satellite channels':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M12 12h.01"></path></svg>;
    case 'Home-cooked meals':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
    case 'Shared kitchen or kitchenette':
    case 'Kitchen Essentials (Oil, Salt, Pepper)':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>;
    case 'Microwave':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 7v10M18 10h.01M18 14h.01" /></svg>;
    case 'Dishwasher':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
    case 'Coffee Maker':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 16v-4m-6-10L4 12m16 0l-2 2m-6-6h.01M12 6.01V6"></path></svg>;
    case 'Housekeeping':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4zM11 4a2 2 0 10-4 0v12a1 1 0 001 1h2a1 1 0 001-1V4zm1-13h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2V5a2 2 0 012-2z"></path></svg>;
    case 'Laundry services':
    case 'Iron/ironing boards':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10M4 20h16"></path></svg>;
    case 'Personalized guided tours':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
    case 'CCTV surveillance':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.872-3.248A1 1 0 0121 7.279v9.442a1 1 0 01-1.128.927L15 14m0 0l-4 4H9.68l-3.328-3.328C5.972 14.28 5 13.568 5 12.656V11a.5.5 0 01.5-.5h4.872l-1.936-3.226A1 1 0 018.872 7v-.058a1 1 0 011.128-.927L15 10z"></path></svg>;
    case 'Secure parking':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4zm-3-4a1 1 0 011-1h10a1 1 0 011 1v12a1 1 0 01-1 1H7a1 1 0 01-1-1V6zM7 21h10"></path></svg>;
    case 'First-aid kits':
    case 'Fire Extinguisher':
    case 'Smoke Alarm':
    case 'Carbon Monoxide Alarm':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.816A2.003 2.003 0 0015 3.033V3a2 2 0 00-2-2H9a2 2 0 00-2 2v.033A2.003 2.003 0 004.382 8.184l-.304 1.52A4 4 0 007.432 19h9.136a4 4 0 003.354-9.293l-.304-1.52z"></path></svg>;
    case 'Fireplaces':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h2a2 2 0 002-2V9a2 2 0 00-2-2h-3V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a2 2 0 00-2 2v9a2 2 0 002 2h2m0 0V4m0 0H4m16 0v4m0 0h-4M7 7h10"></path></svg>;
    case 'Gardens':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 16v-4m-6-10L4 12m16 0l-2 2m-6-6h.01M12 6.01V6"></path></svg>;
    case 'Terraces':
    case 'Outdoor Dining Area':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>;
    case 'Spa treatments':
    case 'Hot Tub':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3V1h4v6m-4 5h.01M16 16v-4h-4v4h4z"></path></svg>;
    case 'Yoga sessions':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    case 'Private Pool':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>;
    case 'BBQ Grill':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 11V7a2 2 0 00-2-2H7a2 2 0 00-2 2v4m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
    case 'Flexible check-in/check-out':
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm3-12h.01M3 17h18a2 2 0 002-2V9a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>;
    default:
      return <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
  }
};

const amenityCategories = {
  "Accommodation Comforts": ["Comfortable beds", "Wardrobes/closets", "Woollen blankets", "Air Conditioning", "Heating"],
  "Essential Facilities": ["Attached bathrooms", "Hot/cold running water", "Western-style toilets", "Toiletries", "Dedicated Workspace"],
  "Connectivity & Entertainment": ["Free Wi-Fi", "High-Speed Internet", "Televisions with cable/satellite channels"],
  "Dining & Kitchen": ["Home-cooked meals", "Shared kitchen or kitchenette", "Microwave", "Dishwasher", "Coffee Maker", "Kitchen Essentials (Oil, Salt, Pepper)"],
  "Guest Services": ["Housekeeping", "Laundry services", "Iron/ironing boards", "Personalized guided tours"],
  "Safety & Security": ["CCTV surveillance", "Secure parking", "First-aid kits", "Smoke Alarm", "Carbon Monoxide Alarm", "Fire Extinguisher"],
  "Unique Touches": ["Fireplaces", "Gardens", "Terraces", "Spa treatments", "Yoga sessions", "Private Pool", "Hot Tub", "Outdoor Dining Area", "BBQ Grill"],
  "Flexibility": ["Flexible check-in/check-out"],
};

const AddProperty = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [customAmenity, setCustomAmenity] = useState('');
  const navigate = useNavigate();

  const totalSteps = 4;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleAmenityChange = (amenity) => {
    const isSelected = formData.amenities.includes(amenity);
    if (!isSelected) {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    } else {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a) => a !== amenity),
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
      roomTypes: [...formData.roomTypes, { name: '', beds: '', occupancy: '', bedType: 'Queen' }],
    });
  };

  const removeRoomType = (index) => {
    const newRoomTypes = formData.roomTypes.filter((_, i) => i !== index);
    setFormData({ ...formData, roomTypes: newRoomTypes });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const handleLocationChange = (pos) => {
    setFormData(prev => ({
      ...prev,
      latitude: pos.lat.toString(),
      longitude: pos.lng.toString()
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.name) errors.name = 'Property name is required';
      if (!formData.type) errors.type = 'Property type is required';
      if (!formData.address) errors.address = 'Address is required';
      if (!formData.description) errors.description = 'Description is required';
      if (!formData.contact) errors.contact = 'Contact is required';
    } else if (step === 2) {
      if (formData.roomTypes.length === 0) errors.roomTypes = 'At least one room type is required';
      formData.roomTypes.forEach((room, index) => {
        if (!room.name) errors[`roomType-${index}-name`] = 'Required';
        if (!room.beds) errors[`roomType-${index}-beds`] = 'Required';
        if (!room.occupancy) errors[`roomType-${index}-occupancy`] = 'Required';
      });
    } else if (step === 3) {
      if (!formData.latitude || !formData.longitude) errors.location = 'Please select a location on the map';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.baseRate) {
      setFormErrors({ baseRate: 'Base rate is required' });
      return;
    }

    try {
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        const uploadData = new FormData();
        selectedFiles.forEach((file) => {
          uploadData.append('images', file);
        });
        const uploadRes = await api.post(`/properties/upload`, uploadData);
        imageUrls = uploadRes.data.files;
      }

      const propertyData = { ...formData, images: imageUrls };
      propertyData.location = {
        type: 'Point',
        coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
      };
      delete propertyData.latitude;
      delete propertyData.longitude;

      await addProperty(propertyData);
      navigate('/dashboard/properties');
    } catch (error) {
      console.error('Failed to add property', error);
      setFormErrors({ general: error.response?.data?.message || 'An unexpected error occurred' });
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-12">
      <div className="flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary transition-all duration-500 -z-10" 
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
        {[1, 2, 3, 4].map(step => (
          <div 
            key={step}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'
            } ${currentStep === step ? 'ring-4 ring-primary/20' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-3 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground px-1">
        <span>Basics</span>
        <span>Details</span>
        <span>Location</span>
        <span>Finalize</span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-4xl p-8 bg-background rounded-3xl shadow-xl border border-border">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-10 flex items-center gap-3">
        <span className="p-2 bg-primary/10 rounded-xl">🏡</span>
        List your Homestay
      </h1>
      
      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-1">Property Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Whispering Pines Villa"
                    className="w-full p-4 bg-card border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                  />
                  {formErrors.name && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{formErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-4 bg-card border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none appearance-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Mountain">Mountain</option>
                    <option value="Riverside">Riverside</option>
                    <option value="Farm">Farm</option>
                    <option value="Forest">Forest</option>
                    <option value="Village">Village</option>
                  </select>
                  {formErrors.type && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{formErrors.type}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-1">Full Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, City, State, ZIP"
                  className="w-full p-4 bg-card border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                />
                {formErrors.address && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{formErrors.address}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell guests about your place..."
                  className="w-full p-4 bg-card border border-border rounded-2xl h-40 resize-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                />
                {formErrors.description && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{formErrors.description}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-1">Contact Number</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full p-4 bg-card border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                />
                {formErrors.contact && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{formErrors.contact}</p>}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-primary">✨</span> Amenities
                </h3>
                <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                  {Object.entries(amenityCategories).map(([category, amenities]) => (
                    <div key={category}>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">{category}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {amenities.map((amenity) => (
                          <div
                            key={amenity}
                            onClick={() => handleAmenityChange(amenity)}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                              formData.amenities.includes(amenity)
                                ? 'bg-primary border-primary text-primary-foreground shadow-lg scale-[1.02]'
                                : 'bg-card border-border text-muted-foreground hover:border-primary/50'
                            }`}
                          >
                            {getAmenityIcon(amenity)}
                            <span className="text-xs font-semibold">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex gap-2 items-center mt-6">
                    <input
                      type="text"
                      value={customAmenity}
                      onChange={(e) => setCustomAmenity(e.target.value)}
                      placeholder="Add custom amenity..."
                      className="flex-1 bg-transparent border-b border-border py-2 text-sm focus:border-primary outline-none text-foreground placeholder:text-muted-foreground"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (customAmenity.trim() && !formData.amenities.includes(customAmenity.trim())) {
                            setFormData({ ...formData, amenities: [...formData.amenities, customAmenity.trim()] });
                            setCustomAmenity('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customAmenity.trim() && !formData.amenities.includes(customAmenity.trim())) {
                          setFormData({ ...formData, amenities: [...formData.amenities, customAmenity.trim()] });
                          setCustomAmenity('');
                        }
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground text-xs rounded-full font-bold shadow-sm hover:bg-primary/90 transition-all active:scale-95"
                    >
                      Add
                    </button>
                  </div>
                  {formData.amenities.filter(a => !Object.values(amenityCategories).flat().includes(a)).length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Custom Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.amenities.filter(a => !Object.values(amenityCategories).flat().includes(a)).map(amenity => (
                          <div key={amenity} className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                            <span>{amenity}</span>
                            <button type="button" onClick={() => handleAmenityChange(amenity)} className="hover:text-red-200 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">🛌 Room Configurations</h3>
                  <button
                    type="button"
                    onClick={addRoomType}
                    className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>
                {formErrors.roomTypes && <p className="text-red-500 text-xs mb-4 italic">{formErrors.roomTypes}</p>}
                <div className="space-y-4">
                  {formData.roomTypes.map((room, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-5 rounded-2xl bg-card border border-border group relative">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold uppercase text-primary">Room Name</label>
                        <input
                          type="text"
                          name="name"
                          value={room.name}
                          onChange={(e) => handleRoomTypeChange(index, e)}
                          placeholder="Master Suite"
                          className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-1 text-sm font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-primary">Bed Type</label>
                        <select
                          name="bedType"
                          value={room.bedType}
                          onChange={(e) => handleRoomTypeChange(index, e)}
                          className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-1 text-sm font-semibold appearance-none"
                        >
                          {['King', 'Queen', 'Double', 'Twin', 'Sofa Bed', 'Bunk Bed'].map(t => (
                            <option key={t} value={t} className="bg-card text-foreground">{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-primary">Beds</label>
                        <input
                          type="number"
                          name="beds"
                          value={room.beds}
                          onChange={(e) => handleRoomTypeChange(index, e)}
                          className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-1 text-sm font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-primary">Max Guests</label>
                        <input
                          type="number"
                          name="occupancy"
                          value={room.occupancy}
                          onChange={(e) => handleRoomTypeChange(index, e)}
                          className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-1 text-sm font-semibold"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRoomType(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">📍 Pin your location</h3>
                <p className="text-muted-foreground text-sm">Help guests find you accurately. Drag the pin or click on the map to set your homestay's coordinates.</p>
              </div>
              
              <LocationPicker 
                lat={formData.latitude} 
                lng={formData.longitude} 
                onChange={handleLocationChange} 
              />
              
              {formErrors.location && <p className="text-red-500 text-sm font-bold italic">{formErrors.location}</p>}
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <section className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-primary">📸</span> Gallery
                </h3>
                <div 
                  className="w-full h-48 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center gap-4 bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer relative group"
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm">Upload Photos</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">High quality JPEG/PNG preferred</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {imagePreviews.map((image, index) => (
                    <div key={index} className="aspect-square relative rounded-2xl overflow-hidden group shadow-md">
                      <img src={image} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                          setImagePreviews(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute top-2 right-2 bg-destructive/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-[8px] font-bold text-center py-1 uppercase text-white tracking-widest">Cover Photo</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-1">Base Rate per Night</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg text-primary">₹</span>
                    <input
                      type="number"
                      name="baseRate"
                      value={formData.baseRate}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full p-4 pl-10 bg-card border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-bold text-lg"
                    />
                  </div>
                  {formErrors.baseRate && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.baseRate}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-1">Initial Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-4 bg-card border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-bold"
                  >
                    <option value="Active">Live</option>
                    <option value="Inactive">Draft / Hidden</option>
                    <option value="Under Construction">Coming Soon</option>
                  </select>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-12 flex justify-between gap-4">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-8 py-3 rounded-2xl font-bold transition-all disabled:opacity-30 border border-border hover:bg-muted"
          >
            Back
          </button>
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-10 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="px-12 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
            >
              Submit Property
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
