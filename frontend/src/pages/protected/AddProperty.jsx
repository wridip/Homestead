import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProperty } from '../../services/hostService';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import LocationPicker from '../../components/property/LocationPicker';
import * as LucideIcons from 'lucide-react';

import { getAmenityIcon } from '../../utils/amenityIcons';

const availableIcons = [
  { name: 'Wifi', label: 'Wi-Fi' },
  { name: 'Tv', label: 'TV' },
  { name: 'Utensils', label: 'Dining' },
  { name: 'Coffee', label: 'Coffee' },
  { name: 'Bath', label: 'Bath' },
  { name: 'Bed', label: 'Bed' },
  { name: 'Wind', label: 'AC' },
  { name: 'Thermometer', label: 'Heating' },
  { name: 'Flower2', label: 'Garden' },
  { name: 'Palmtree', label: 'Outdoor' },
  { name: 'Waves', label: 'Pool/Water' },
  { name: 'Smile', label: 'Wellness' },
  { name: 'Car', label: 'Parking' },
  { name: 'Cctv', label: 'CCTV' },
  { name: 'Activity', label: 'Gym' },
  { name: 'ShieldAlert', label: 'Safety' },
  { name: 'Flame', label: 'Fireplace' },
  { name: 'Sparkles', label: 'Premium' },
  { name: 'Gift', label: 'Gift' },
  { name: 'Heart', label: 'Love' },
  { name: 'Sun', label: 'Sunlight' },
  { name: 'Moon', label: 'Night' },
  { name: 'TreePine', label: 'Forest' },
  { name: 'Mountain', label: 'Mountain' },
  { name: 'Dumbbell', label: 'Weights' },
  { name: 'Gamepad2', label: 'Games' },
  { name: 'Bike', label: 'Bikes' },
  { name: 'PawPrint', label: 'Pets' }
];

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
  const [selectedCustomIcon, setSelectedCustomIcon] = useState('Sparkles');
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
                      <option value="" className="bg-card text-foreground">Select Category</option>
                      <option value="Mountain" className="bg-card text-foreground">Mountain</option>
                      <option value="Riverside" className="bg-card text-foreground">Riverside</option>
                      <option value="Farm" className="bg-card text-foreground">Farm</option>
                      <option value="Forest" className="bg-card text-foreground">Forest</option>
                      <option value="Village" className="bg-card text-foreground">Village</option>
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
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={customAmenity}
                        onChange={(e) => setCustomAmenity(e.target.value)}
                        placeholder="Add custom amenity..."
                        className="flex-1 bg-transparent border-b border-border py-2 text-sm focus:border-primary outline-none text-foreground placeholder:text-muted-foreground"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (customAmenity.trim()) {
                              const nameToCheck = customAmenity.trim();
                              const alreadyExists = formData.amenities.some(a => {
                                const existingName = a.includes('|') ? a.split('|')[0] : a;
                                return existingName.toLowerCase() === nameToCheck.toLowerCase();
                              });
                              if (!alreadyExists) {
                                const finalAmenity = `${customAmenity.trim()}|${selectedCustomIcon}`;
                                setFormData({ ...formData, amenities: [...formData.amenities, finalAmenity] });
                              }
                              setCustomAmenity('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customAmenity.trim()) {
                            const nameToCheck = customAmenity.trim();
                            const alreadyExists = formData.amenities.some(a => {
                              const existingName = a.includes('|') ? a.split('|')[0] : a;
                              return existingName.toLowerCase() === nameToCheck.toLowerCase();
                            });
                            if (!alreadyExists) {
                              const finalAmenity = `${customAmenity.trim()}|${selectedCustomIcon}`;
                              setFormData({ ...formData, amenities: [...formData.amenities, finalAmenity] });
                            }
                            setCustomAmenity('');
                          }
                        }}
                        className="px-4 py-2 bg-primary text-primary-foreground text-xs rounded-full font-bold shadow-sm hover:bg-primary/90 transition-all active:scale-95"
                      >
                        Add
                      </button>
                    </div>

                    <div className="mt-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Select Custom Icon</label>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {availableIcons.map((ico) => {
                          const IconComponent = LucideIcons[ico.name] || LucideIcons.Star;
                          return (
                            <button
                              key={ico.name}
                              type="button"
                              onClick={() => setSelectedCustomIcon(ico.name)}
                              className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs min-w-[65px] transition-all cursor-pointer ${
                                selectedCustomIcon === ico.name
                                  ? 'bg-primary border-primary text-primary-foreground'
                                  : 'bg-card border-border text-muted-foreground hover:border-primary/50'
                              }`}
                            >
                              <IconComponent className="h-5 w-5 shrink-0" />
                              <span className="text-[9px] font-medium whitespace-nowrap">{ico.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {formData.amenities.filter(a => !Object.values(amenityCategories).flat().includes(a)).length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Custom Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.amenities.filter(a => !Object.values(amenityCategories).flat().includes(a)).map(amenity => (
                          <div key={amenity} className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                            {getAmenityIcon(amenity)}
                            <span>{amenity.includes('|') ? amenity.split('|')[0] : amenity}</span>
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
                address={formData.address}
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
