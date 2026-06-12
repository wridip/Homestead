import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const PhotoGallery = ({ images, propertyName }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const getUrl = (img) => getImageUrl(img);

  // If we don't have enough images for a grid, fallback safely for layout
  const displayImages = images.length >= 5 ? images : [...images, ...Array(5 - images.length).fill('default-property.png')];

  const openImage = (index) => {
    if (index < images.length) {
      setSelectedIndex(index);
    } else {
      setSelectedIndex(0);
    }
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (selectedIndex !== null && selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (selectedIndex !== null && selectedIndex < images.length - 1) setSelectedIndex(selectedIndex + 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') {
        if (showAll) setSelectedIndex(null);
        else { setSelectedIndex(null); setShowAll(false); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, showAll]);

  return (
    <div className="relative mb-16 mt-8">
      {/* Editorial Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-[300px] md:h-[460px] overflow-hidden rounded-[2rem]">
        
        {/* Massive Hero Image (Left, 7 columns) */}
        <motion.div 
          className="md:col-span-7 h-full relative overflow-hidden group cursor-pointer"
          whileHover={{ scale: 0.995 }}
          onClick={() => openImage(0)}
        >
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
          <img
            src={getUrl(displayImages[0])}
            alt={propertyName}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </motion.div>
        
        {/* Right Side Grid (5 columns) */}
        <div className="hidden md:grid md:col-span-5 grid-rows-2 gap-3 h-full">
          
          {/* Top Row (Split into 2) */}
          <div className="grid grid-cols-2 gap-3 h-full">
            <motion.div className="h-full relative overflow-hidden group cursor-pointer" whileHover={{ scale: 0.98 }} onClick={() => openImage(1)}>
               <img src={getUrl(displayImages[1])} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
            </motion.div>
            <motion.div className="h-full relative overflow-hidden group cursor-pointer" whileHover={{ scale: 0.98 }} onClick={() => openImage(2)}>
               <img src={getUrl(displayImages[2])} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
            </motion.div>
          </div>
          
          {/* Bottom Row (Full width of the right side) */}
          <motion.div className="h-full relative overflow-hidden group cursor-pointer" whileHover={{ scale: 0.99 }} onClick={() => openImage(3)}>
             <img src={getUrl(displayImages[3])} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
             
             {/* Gradient overlay for the button */}
             <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
             
             {/* Show All Photos Button directly on the last image */}
             <button 
                onClick={(e) => { e.stopPropagation(); setShowAll(true); }}
                className="absolute bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-background/40 backdrop-blur-md border border-border hover:bg-primary text-foreground hover:text-primary-foreground text-sm font-bold tracking-wide uppercase rounded-full shadow-2xl transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
                View Gallery
              </button>
          </motion.div>
        </div>
      </div>

      {/* Full View Modal */}
      <AnimatePresence>
        {(selectedIndex !== null || showAll) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-xl flex flex-col z-[100]"
            onClick={() => {
              if (showAll && selectedIndex !== null) setSelectedIndex(null);
              else { setSelectedIndex(null); setShowAll(false); }
            }}
          >
            <div className="flex justify-between items-center p-6 sticky top-0 z-10">
              <button 
                className="text-foreground hover:bg-muted p-3 rounded-full transition-colors flex items-center justify-center bg-background/20 backdrop-blur-md shadow-sm"
                onClick={(e) => { 
                  e.stopPropagation();
                  if (showAll && selectedIndex !== null) setSelectedIndex(null);
                  else { setSelectedIndex(null); setShowAll(false); }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
              </button>
              <button
                className="px-6 py-2 border border-border bg-card/50 text-foreground rounded-full font-bold hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); setShowAll(false); }}
              >
                Close
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-8" onClick={(e) => e.stopPropagation()}>
              {showAll && selectedIndex === null ? (
                /* GRID VIEW */
                <div className="max-w-5xl mx-auto space-y-12 pb-12">
                  <h2 className="text-4xl font-serif text-foreground mb-12 text-center">Gallery — <span className="italic text-primary">{propertyName}</span></h2>
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map((img, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                        <img 
                          src={getUrl(img)} 
                          className="w-full rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in" 
                          onClick={() => setSelectedIndex(i)} 
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                /* SINGLE VIEW (CAROUSEL) */
                <div className="h-full w-full flex items-center justify-center relative pb-10">
                  {selectedIndex > 0 && (
                    <button 
                      onClick={handlePrev} 
                      className="absolute left-2 md:left-8 p-3 md:p-4 bg-background/50 hover:bg-primary hover:text-primary-foreground text-foreground rounded-full backdrop-blur-md transition-all shadow-xl z-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                    </button>
                  )}
                  
                  <img src={getUrl(images[selectedIndex])} alt="Full view" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl select-none" />

                  {selectedIndex < images.length - 1 && (
                    <button 
                      onClick={handleNext} 
                      className="absolute right-2 md:right-8 p-3 md:p-4 bg-background/50 hover:bg-primary hover:text-primary-foreground text-foreground rounded-full backdrop-blur-md transition-all shadow-xl z-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
                    </button>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 text-center text-foreground font-semibold bg-background/40 backdrop-blur-md px-4 py-1.5 rounded-full w-fit mx-auto shadow-lg">
                     {selectedIndex + 1} / {images.length}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGallery;