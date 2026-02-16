import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const LocationMap = ({ center, isLoaded }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2">
      Location
    </h2>
    <div className="mt-4 rounded-lg overflow-hidden">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '450px' }}
          center={center}
          zoom={15}
          options={{
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            ],
          }}
        >
          <Marker position={center} />
        </GoogleMap>
      ) : (
        <div className="text-neutral-200">Loading Map...</div>
      )}
    </div>
  </div>
);

export default LocationMap;
