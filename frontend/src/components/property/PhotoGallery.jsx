import React, { useState } from 'react';

const PhotoGallery = ({ images, propertyName }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <img
            src={`http://localhost:5000/${images[0].replace(/\\/g, '/')}`}
            alt={propertyName}
            className="w-full h-full object-cover rounded-lg shadow-lg cursor-pointer"
            onClick={() => setSelectedImage(`http://localhost:5000/${images[0].replace(/\\/g, '/')}`)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((image, index) => (
            <img
              key={index}
              src={`http://localhost:5000/${image.replace(/\\/g, '/')}`}
              alt={`${propertyName} ${index + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-lg cursor-pointer"
              onClick={() => setSelectedImage(`http://localhost:5000/${image.replace(/\\/g, '/')}`)}
            />
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Full view" className="max-w-full max-h-[90vh] object-contain" />
            <button
              className="absolute top-2 right-2 bg-white text-black rounded-full p-2 text-xl font-bold"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
