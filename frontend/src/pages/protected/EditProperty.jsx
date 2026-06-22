import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPropertyById, updateProperty, updatePropertyImages } from '../../services/propertyService';
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
  const [formErrors, setFormErrors] = useState({}); // New state for form errors
  const [customAmenity, setCustomAmenity] = useState('');
  const [selectedCustomIcon, setSelectedCustomIcon] = useState('Sparkles');
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
    setFormErrors({ ...formErrors, [name]: '' }); // Clear error when user types
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

    const errors = {};
    if (!formData.name) errors.name = 'Property name is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.type) errors.type = 'Property type is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.contact) errors.contact = 'Contact is required';
    if (!formData.baseRate) errors.baseRate = 'Base rate is required';
    else if (isNaN(formData.baseRate) || parseFloat(formData.baseRate) <= 0) errors.baseRate = 'Base rate must be a positive number';

    if (formData.latitude && isNaN(formData.latitude)) errors.latitude = 'Latitude must be a number';
    if (formData.longitude && isNaN(formData.longitude)) errors.longitude = 'Longitude must be a number';

    if (formData.roomTypes.length > 0) {
      formData.roomTypes.forEach((room, index) => {
        if (!room.name) errors[`roomType-${index}-name`] = `Room name for Room ${index + 1} is required`;
        if (isNaN(room.beds) || parseInt(room.beds) <= 0) errors[`roomType-${index}-beds`] = `Number of beds for Room ${index + 1} must be a positive integer`;
        if (isNaN(room.occupancy) || parseInt(room.occupancy) <= 0) errors[`roomType-${index}-occupancy`] = `Max occupancy for Room ${index + 1} must be a positive integer`;
      });
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Prevent form submission
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
      setFormErrors({ general: errorMessage });
    }
  };

  return (
    <div className="container mx-auto p-8 bg-background rounded-2xl shadow-lg backdrop-blur-sm border border-border">
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Property</h1>
      {formErrors.general && <p className="text-red-500 text-sm mb-4">{formErrors.general}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="p-4 border border-border rounded bg-card">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                name="name"
                placeholder="Property Name"
                value={formData.name}
                onChange={handleChange}
                className="p-2 bg-transparent border border-border rounded text-foreground focus:ring-2 focus:ring-primary"
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>
            <div className="flex flex-col">
              <select
                name="type"
                onChange={handleChange}
                value={formData.type}
                className="p-3 bg-transparent border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary bg-card"
                required
              >
                <option value="" className="bg-card text-foreground">Select Property Type</option>
                <option value="Mountain" className="bg-card text-foreground">Mountain</option>
                <option value="Riverside" className="bg-card text-foreground">Riverside</option>
                <option value="Farm" className="bg-card text-foreground">Farm</option>
                <option value="Forest" className="bg-card text-foreground">Forest</option>
                <option value="Village" className="bg-card text-foreground">Village</option>
              </select>
              {formErrors.type && <p className="text-red-500 text-sm mt-1">{formErrors.type}</p>}
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="p-2 bg-transparent border border-border rounded text-foreground focus:ring-2 focus:ring-primary"
              />
              {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
            </div>
            <div className="flex flex-col col-span-2">
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="p-2 bg-transparent border border-border rounded col-span-2 text-foreground focus:ring-2 focus:ring-primary"
              />
              {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                name="contact"
                placeholder="Contact"
                value={formData.contact}
                onChange={handleChange}
                className="p-2 bg-transparent border border-border rounded text-foreground focus:ring-2 focus:ring-primary"
              />
              {formErrors.contact && <p className="text-red-500 text-sm mt-1">{formErrors.contact}</p>}
            </div>
          </div>
        </div>

        {/* Location & Maps */}
        <div className="p-4 border border-border rounded bg-card">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Location & Maps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="p-2 bg-transparent border border-border rounded text-foreground focus:ring-2 focus:ring-primary"
              />
              {formErrors.latitude && <p className="text-red-500 text-sm mt-1">{formErrors.latitude}</p>}
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="p-2 bg-transparent border border-border rounded text-foreground focus:ring-2 focus:ring-primary"
              />
              {formErrors.longitude && <p className="text-red-500 text-sm mt-1">{formErrors.longitude}</p>}
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="p-4 border border-border rounded bg-card">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Amenities</h2>
          <div className="space-y-6">
            {Object.entries(amenityCategories).map(([category, amenities]) => (
              <div key={category}>
                <h3 className="text-xl font-medium text-muted-foreground mb-3">{category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all duration-200
                        ${formData.amenities.includes(amenity)
                          ? 'bg-primary border-primary text-primary-foreground shadow-lg'
                          : 'bg-card border-border text-muted-foreground hover:bg-accent hover:border-primary'
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

          {/* Custom Amenity section */}
          <div className="mt-6 border-t border-border pt-4">
            <h3 className="text-xl font-medium text-muted-foreground mb-3">Custom Amenities</h3>
            <div className="space-y-4 mb-4">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  placeholder="Add custom amenity..."
                  className="flex-1 bg-transparent border border-border p-2 rounded text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground"
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
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded font-medium shadow hover:bg-primary/90 transition-all cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div>
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
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.amenities.filter(a => !Object.values(amenityCategories).flat().includes(a)).map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium shadow">
                    {getAmenityIcon(amenity)}
                    <span>{amenity.includes('|') ? amenity.split('|')[0] : amenity}</span>
                    <button type="button" onClick={() => handleAmenityChange({ target: { value: amenity, checked: false } })} className="hover:text-red-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Room Types */}
        <div className="p-4 border border-border rounded bg-card">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Room Types</h2>
          {formData.roomTypes.map((room, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <div className="flex flex-col">
                <input
                  type="text"
                  name="name"
                  placeholder="Room Name"
                  value={room.name}
                  onChange={(e) => handleRoomTypeChange(index, e)}
                  className="p-2 bg-transparent border border-border rounded text-foreground focus:ring-2 focus:ring-primary"
                />
                {formErrors[`roomType-${index}-name`] && <p className="text-red-500 text-sm mt-1">{formErrors[`roomType-${index}-name`]}</p>}
              </div>
              <div className="flex flex-col">
                <input
                  type="number"
                  name="beds"
                  placeholder="Beds"
                  value={room.beds}
                  onChange={(e) => handleRoomTypeChange(index, e)}
                  className="p-2 bg-transparent border border-border rounded text-foreground focus:ring-2 focus:ring-primary"
                />
                {formErrors[`roomType-${index}-beds`] && <p className="text-red-500 text-sm mt-1">{formErrors[`roomType-${index}-beds`]}</p>}
              </div>
              <div className="flex flex-col">
                <input
                  type="number"
                  name="occupancy"
                  placeholder="Occupancy"
                  value={room.occupancy}
                  onChange={(e) => handleRoomTypeChange(index, e)}
                  className="p-2 bg-transparent border border-border rounded text-foreground focus:ring-2 focus:ring-primary"
                />
                {formErrors[`roomType-${index}-occupancy`] && <p className="text-red-500 text-sm mt-1">{formErrors[`roomType-${index}-occupancy`]}</p>}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addRoomType}
            className="bg-muted text-muted-foreground px-4 py-2 rounded hover:bg-accent transition-colors"
          >
            Add Room Type
          </button>
        </div>

        {/* Pricing & Availability */}
        <div className="p-4 border border-border rounded bg-card">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Pricing & Availability</h2>
          <div className="flex flex-col">
            <input
              type="number"
              name="baseRate"
              placeholder="Base Rate"
              value={formData.baseRate}
              onChange={handleChange}
              className="p-2 bg-transparent border border-border rounded text-foreground focus:ring-2 focus:ring-primary"
            />
            {formErrors.baseRate && <p className="text-red-500 text-sm mt-1">{formErrors.baseRate}</p>}
          </div>
        </div>

        {/* Images & Media */}
        <div className="p-4 border border-border rounded bg-card">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Images & Media</h2>
          <input type="file" multiple onChange={handleImageChange} className="p-2 bg-transparent border border-border rounded text-foreground" />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagePreviews.map((image, index) => (
              <div key={image} className="relative group">
                <img 
                  src={image}
                  alt="preview" 
                  className="w-full h-32 object-cover rounded-lg" 
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="p-4 border border-border rounded bg-card">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Status</h2>
          <select name="status" value={formData.status} onChange={handleChange} className="p-2 bg-transparent border border-border rounded text-foreground bg-card">
            <option value="Active" className="bg-card text-foreground">Active</option>
            <option value="Inactive" className="bg-card text-foreground">Inactive</option>
            <option value="Under Construction" className="bg-card text-foreground">Under Construction</option>
          </select>
        </div>

        <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Update Property
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
