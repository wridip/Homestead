import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images && property.images.length > 0 ? property.images : ['default-property.png'];

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300" data-animate>
      <Link to={`/property/${property._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={currentImageIndex}
              src={getImageUrl(images[currentImageIndex])}
              alt={`${property.name} - ${currentImageIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full object-cover"
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={prevImage}
                className="rounded-full bg-background/80 p-1.5 text-foreground hover:bg-background shadow-sm backdrop-blur-sm transition-transform active:scale-90"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button
                onClick={nextImage}
                className="rounded-full bg-background/80 p-1.5 text-foreground hover:bg-background shadow-sm backdrop-blur-sm transition-transform active:scale-90"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          )}

          {/* Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {property.isEcoFriendly && (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
              Eco+ Certified
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold tracking-tight text-foreground truncate">{property.name}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
              <span className="text-xs font-bold text-foreground">{property.averageRating || 'New'}</span>
            </div>
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{property.address || property.location?.name}</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">
              ₹{(property.baseRate || 0).toLocaleString()}
              <span className="ml-1 text-xs font-normal text-muted-foreground">/night</span>
            </p>
            <span className="text-xs font-semibold text-primary group-hover:underline">Details →</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PropertyCard;
