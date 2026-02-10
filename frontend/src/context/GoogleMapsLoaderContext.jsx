import React, { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { libraries } from '../config/googleMaps';

const GoogleMapsLoaderContext = createContext(null);

export const GoogleMapsLoaderProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries, // This should now include both "maps" and "places"
  });

  return (
    <GoogleMapsLoaderContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsLoaderContext.Provider>
  );
};

export const useGoogleMapsLoader = () => useContext(GoogleMapsLoaderContext);
