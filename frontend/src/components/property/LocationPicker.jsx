import React, { useState, useCallback, useEffect } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { mapId } from '../../config/googleMaps';

const LocationPicker = ({ lat, lng, onChange }) => {
  const map = useMap();
  const [markerPos, setMarkerPos] = useState({ lat: parseFloat(lat) || 20.5937, lng: parseFloat(lng) || 78.9629 });

  useEffect(() => {
    if (lat && lng) {
      setMarkerPos({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }
  }, [lat, lng]);

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

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-border shadow-inner bg-muted">
      <Map
        mapId={mapId}
        defaultCenter={markerPos}
        defaultZoom={5}
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
        <span>Click anywhere to drop pin</span>
        <span>Lat: {markerPos.lat.toFixed(4)} , Lng: {markerPos.lng.toFixed(4)}</span>
      </div>
    </div>
  );
};

export default LocationPicker;
