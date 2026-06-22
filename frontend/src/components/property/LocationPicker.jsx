import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { mapId } from '../../config/googleMaps';

const LocationPicker = ({ lat, lng, onChange, address }) => {
  const map = useMap();
  const [markerPos, setMarkerPos] = useState({ lat: parseFloat(lat) || 20.5937, lng: parseFloat(lng) || 78.9629 });
  const [searchQuery, setSearchQuery] = useState(address || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const hasGeocodedInitial = useRef(false);

  useEffect(() => {
    if (lat && lng) {
      const newLat = parseFloat(lat);
      const newLng = parseFloat(lng);
      if (!isNaN(newLat) && !isNaN(newLng)) {
        setMarkerPos({ lat: newLat, lng: newLng });
      }
    }
  }, [lat, lng]);

  const geocodeAddress = useCallback((addressToSearch) => {
    if (!window.google || !window.google.maps) {
      setSearchError('Google Maps API not fully loaded yet. Please try again.');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: addressToSearch }, (results, status) => {
      setIsSearching(false);
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const newPos = {
          lat: location.lat(),
          lng: location.lng()
        };
        setMarkerPos(newPos);
        onChange(newPos);
        if (map) {
          map.panTo(newPos);
          map.setZoom(14);
        }
      } else {
        if (status === 'REQUEST_DENIED') {
          setSearchError('Address search is restricted on this Google API key. Please manually drag the pin or click on the map to pinpoint your location.');
        } else if (status === 'ZERO_RESULTS') {
          setSearchError('Address not found. Please try a different area name, or manually pin the location on the map.');
        } else {
          setSearchError(`Address search failed (${status}). Please pin your location manually.`);
        }
        console.error('Geocode failed due to: ' + status);
      }
    });
  }, [map, onChange]);

  // Auto-pin to initial address on map load
  useEffect(() => {
    if (map && address && !lat && !lng && !hasGeocodedInitial.current) {
      hasGeocodedInitial.current = true;
      geocodeAddress(address);
    }
  }, [map, address, lat, lng, geocodeAddress]);

  const onMarkerDragEnd = useCallback((e) => {
    const newPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setMarkerPos(newPos);
    onChange(newPos);
  }, [onChange]);

  const onMapClick = useCallback((e) => {
    const newPos = {
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng
    };
    setMarkerPos(newPos);
    onChange(newPos);
  }, [onChange]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      geocodeAddress(searchQuery.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input Fallback Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location or area to pin..."
          className="flex-1 p-3 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none text-foreground"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-6 py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 uppercase tracking-wider whitespace-nowrap"
        >
          {isSearching ? (
            <span>Searching...</span>
          ) : (
            <>
              <span>🔍 Search Area</span>
            </>
          )}
        </button>
      </form>

      {searchError && (
        <p className="text-red-500 text-xs font-semibold ml-1">{searchError}</p>
      )}

      {/* Map Container */}
      <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-border shadow-inner bg-muted relative">
        <Map
          mapId={mapId}
          defaultCenter={markerPos}
          defaultZoom={lat && lng ? 14 : 5}
          onClick={onMapClick}
          disableDefaultUI={true}
          zoomControl={true}
          colorScheme="DARK"
          gestureHandling={'greedy'}
        >
          <AdvancedMarker
            position={markerPos}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
          />
        </Map>
        <div className="p-3 bg-card border-t border-border flex justify-between text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
          <span>Click anywhere or drag pin to adjust location</span>
          <span>Lat: {markerPos.lat.toFixed(6)} , Lng: {markerPos.lng.toFixed(6)}</span>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
