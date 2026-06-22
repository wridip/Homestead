import React from 'react';
import * as LucideIcons from 'lucide-react';

export const getAmenityIcon = (amenity) => {
  const iconProps = { className: "h-5 w-5 text-primary shrink-0" };
  if (!amenity) return <LucideIcons.Star {...iconProps} />;

  // If the amenity is formatted like "Amenity Name|IconName"
  let amenityName = amenity;
  let customIconName = null;
  if (amenity.includes('|')) {
    const parts = amenity.split('|');
    amenityName = parts[0];
    customIconName = parts[1];
  }

  if (customIconName) {
    const IconComponent = LucideIcons[customIconName];
    if (IconComponent) {
      return <IconComponent {...iconProps} />;
    }
  }

  const lowerAmenity = amenityName.toLowerCase();

  switch (amenityName) {
    case 'Comfortable beds':
    case 'Wardrobes/closets':
    case 'Woollen blankets':
      return <LucideIcons.Bed {...iconProps} />;
    case 'Air Conditioning':
      return <LucideIcons.Wind {...iconProps} />;
    case 'Heating':
      return <LucideIcons.Thermometer {...iconProps} />;
    case 'Attached bathrooms':
    case 'Western-style toilets':
      return <LucideIcons.Bath {...iconProps} />;
    case 'Hot/cold running water':
    case 'Toiletries':
      return <LucideIcons.Droplets {...iconProps} />;
    case 'Free Wi-Fi':
    case 'High-Speed Internet':
      return <LucideIcons.Wifi {...iconProps} />;
    case 'Televisions with cable/satellite channels':
      return <LucideIcons.Tv {...iconProps} />;
    case 'Home-cooked meals':
    case 'Shared kitchen or kitchenette':
    case 'Kitchen Essentials (Oil, Salt, Pepper)':
      return <LucideIcons.Utensils {...iconProps} />;
    case 'Microwave':
    case 'Dishwasher':
      return <LucideIcons.UtensilsCrossed {...iconProps} />;
    case 'Coffee Maker':
      return <LucideIcons.Coffee {...iconProps} />;
    case 'Housekeeping':
    case 'Laundry services':
    case 'Iron/ironing boards':
      return <LucideIcons.Shirt {...iconProps} />;
    case 'Personalized guided tours':
      return <LucideIcons.Map {...iconProps} />;
    case 'CCTV surveillance':
      return <LucideIcons.Cctv {...iconProps} />;
    case 'Secure parking':
      return <LucideIcons.Car {...iconProps} />;
    case 'First-aid kits':
      return <LucideIcons.Activity {...iconProps} />;
    case 'Fire Extinguisher':
    case 'Smoke Alarm':
    case 'Carbon Monoxide Alarm':
      return <LucideIcons.ShieldAlert {...iconProps} />;
    case 'Fireplaces':
      return <LucideIcons.Flame {...iconProps} />;
    case 'Gardens':
      return <LucideIcons.Flower2 {...iconProps} />;
    case 'Terraces':
    case 'Outdoor Dining Area':
      return <LucideIcons.Palmtree {...iconProps} />;
    case 'Spa treatments':
    case 'Hot Tub':
    case 'Private Pool':
      return <LucideIcons.Waves {...iconProps} />;
    case 'Yoga sessions':
      return <LucideIcons.Smile {...iconProps} />;
    case 'Flexible check-in/check-out':
      return <LucideIcons.CheckSquare {...iconProps} />;
    case 'Dedicated Workspace':
      return <LucideIcons.CheckCircle2 {...iconProps} />;
    default:
      if (lowerAmenity.includes('wifi') || lowerAmenity.includes('internet')) return <LucideIcons.Wifi {...iconProps} />;
      if (lowerAmenity.includes('parking') || lowerAmenity.includes('car')) return <LucideIcons.Car {...iconProps} />;
      if (lowerAmenity.includes('kitchen') || lowerAmenity.includes('cook') || lowerAmenity.includes('food') || lowerAmenity.includes('meal')) return <LucideIcons.Utensils {...iconProps} />;
      if (lowerAmenity.includes('bath') || lowerAmenity.includes('toilet') || lowerAmenity.includes('shower')) return <LucideIcons.Bath {...iconProps} />;
      if (lowerAmenity.includes('tv') || lowerAmenity.includes('television')) return <LucideIcons.Tv {...iconProps} />;
      if (lowerAmenity.includes('yoga') || lowerAmenity.includes('spa') || lowerAmenity.includes('massage')) return <LucideIcons.Smile {...iconProps} />;
      if (lowerAmenity.includes('pool') || lowerAmenity.includes('swim')) return <LucideIcons.Waves {...iconProps} />;
      if (lowerAmenity.includes('bed')) return <LucideIcons.Bed {...iconProps} />;
      return <LucideIcons.Star {...iconProps} />;
  }
};
