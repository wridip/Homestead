import React, { createContext, useContext } from 'react';
import { APIProvider, useApiIsLoaded } from '@vis.gl/react-google-maps';
import { libraries } from '../config/googleMaps';

const GoogleMapsLoaderContext = createContext(null);

const LoaderStateWrapper = ({ children }) => {
  const isLoaded = useApiIsLoaded();
  return (
    <GoogleMapsLoaderContext.Provider value={{ isLoaded, loadError: null }}>
      {children}
    </GoogleMapsLoaderContext.Provider>
  );
};

export const GoogleMapsLoaderProvider = ({ children }) => {
  return (
    <APIProvider 
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} 
      libraries={libraries}
    >
      <LoaderStateWrapper>
        {children}
      </LoaderStateWrapper>
    </APIProvider>
  );
};

export const useGoogleMapsLoader = () => useContext(GoogleMapsLoaderContext);
