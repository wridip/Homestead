import React, { useRef } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useGoogleMapsLoader } from '../../context/GoogleMapsLoaderContext';

const LocationSearchInput = ({ value, onChange, placeholder }) => {
    const { isLoaded, loadError } = useGoogleMapsLoader();


    const searchBoxRef = useRef(null);

    const handlePlacesChanged = () => {
        const places = searchBoxRef.current.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            const locationName = place.formatted_address;
            onChange(locationName); // Use the onChange prop from the parent
        }
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={handlePlacesChanged}
        >
            <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-transparent text-sm placeholder-neutral-400 focus:outline-none text-white"
                defaultValue={value}
            />
        </StandaloneSearchBox>
    );
};

export default LocationSearchInput;
