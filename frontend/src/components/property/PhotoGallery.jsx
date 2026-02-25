import React, { useState } from 'react';

const PhotoGallery = ({ images, propertyName }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const getUrl = (img) => `http://localhost:5000/${img.replace(/\\/g, '/')}`;

  return (
    <div className="relative mb-12 group">
      {/* 5-Photo Grid (Airbnb Style) */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[350px] md:h-[500px] overflow-hidden rounded-2xl border border-neutral-800 shadow-2xl">
        {/* Main large image */}
        <div className="col-span-2 row-span-2 relative overflow-hidden group/item">
          <img
            src={getUrl(images[0])}
            alt={propertyName}
            className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all duration-300"
            onClick={() => setSelectedImage(getUrl(images[0]))}
          />
        </div>
        
        {/* Smaller side images */}
        {images.slice(1, 5).map((image, index) => (
          <div key={index} className="col-span-1 row-span-1 relative overflow-hidden group/item">
            <img
              src={getUrl(image)}
              alt={`${propertyName} ${index + 1}`}
              className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all duration-300"
              onClick={() => setSelectedImage(getUrl(image))}
            />
          </div>
        ))}

        {/* Show All Photos Button */}
        <button 
          onClick={() => setShowAll(true)}
          className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-neutral-900/90 border border-neutral-700 hover:bg-neutral-800 text-white text-sm font-semibold rounded-lg shadow-xl transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
          Show all photos
        </button>
      </div>

      {/* Full View Modal */}
      {(selectedImage || showAll) && (
        <div
          className="fixed inset-0 bg-neutral-950 flex flex-col z-[100] animate-in fade-in duration-300"
          onClick={() => { setSelectedImage(null); setShowAll(false); }}
        >
          <div className="flex justify-between items-center p-6 bg-neutral-950/80 backdrop-blur sticky top-0 z-10">
            <button className="text-white hover:bg-neutral-800 p-2 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
            </button>
            <button
              className="px-4 py-2 bg-neutral-800 text-white rounded-lg font-medium hover:bg-neutral-700 transition-colors"
              onClick={() => { setSelectedImage(null); setShowAll(false); }}
            >
              Close
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-8" onClick={(e) => e.stopPropagation()}>
            {showAll ? (
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold text-white mb-12 italic">Photos of {propertyName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((img, i) => (
                    <img key={i} src={getUrl(img)} className="w-full rounded-xl shadow-2xl hover:scale-[1.01] transition-transform" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <img src={selectedImage} alt="Full view" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
