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

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-12 pt-12 border-t border-border">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground italic">Location</h2>
          <p className="text-sm text-muted-foreground mt-1">Exact location provided after booking</p>
        </div>
        <button
          onClick={openGoogleMaps}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-bold shadow-lg hover:bg-primary/90 transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m20 12-8 8-8-8"/><path d="m12 2 8 8-8 8"/></svg>
          Get Directions
        </button>
      </div>

      <div className="rounded-3xl overflow-hidden border border-border shadow-2xl bg-muted/30 relative group">
        {isLoaded ? (
          <Map
            style={{ width: '100%', height: '450px' }}
            defaultCenter={center}
            defaultZoom={15}
            mapId={mapId}
            colorScheme="DARK"
            disableDefaultUI={false}
            gestureHandling={'greedy'}
          >
            <AdvancedMarker 
              position={center} 
              onClick={openGoogleMaps}
            >
              <div className="bg-primary p-2 rounded-full shadow-2xl border-4 border-background cursor-pointer hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              </div>
            </AdvancedMarker>
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
