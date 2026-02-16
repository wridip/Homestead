import React from 'react';

const PhotoGallery = ({ images, propertyName }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
    <div className="col-span-1">
      <img
        src={`http://localhost:5000/${images[0].replace(/\//g, '/')}`}
        alt={propertyName}
        className="w-full h-full object-cover rounded-lg shadow-lg"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      {images.slice(1, 5).map((image, index) => (
        <img
          key={index}
          src={`http://localhost:5000/${image.replace(/\//g, '/')}`}
          alt={`${propertyName} ${index + 1}`}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      ))}
    </div>
  </div>
);

export default PhotoGallery;
