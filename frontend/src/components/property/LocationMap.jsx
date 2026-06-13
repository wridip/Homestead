import React from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { mapId } from '../../config/googleMaps';

const LocationMap = ({ center, isLoaded, loadError }) => {
  if (loadError) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
          Location
        </h2>
        <div className="mt-4 p-8 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-center">
          <p className="font-medium">Failed to load the map.</p>
          <p className="text-sm mt-1">Please check your internet connection or API key configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
        Location
      </h2>
      <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-inner bg-muted/30">
        {isLoaded ? (
          <Map
            style={{ width: '100%', height: '450px' }}
            center={center}
            zoom={15}
            mapId={mapId}
            disableDefaultUI={false}
          >
            <AdvancedMarker position={center} />
          </Map>
        ) : (
          <div className="flex items-center justify-center h-[450px] text-muted-foreground animate-pulse">
            <div className="flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin h-6 w-6"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              <span>Loading Map...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationMap;
