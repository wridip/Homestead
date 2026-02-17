import React, { useRef } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useGoogleMapsLoader } from '../../context/GoogleMapsLoaderContext';

const searchOptions = {
    types: ['(cities)'],
    componentRestrictions: { country: "in" }, // Example: Restrict to India
};


const LocationSearchInput = ({ value, onChange, placeholder }) => {
    const { isLoaded, loadError } = useGoogleMapsLoader();
    const searchBoxRef = useRef(null);

    const handlePlacesChanged = () => {
        const places = searchBoxRef.current.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            const locationName = place.formatted_address;
            onChange(locationName);
        }
    };

    if (loadError) {
        return <div>Error loading maps. Please check your API key and configuration.</div>;
    }

    if (!isLoaded) {
        return <input type="text" placeholder="Loading search..." className="w-full bg-transparent text-sm placeholder-neutral-400 focus:outline-none text-white" disabled />;
    }

    return (
        <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={handlePlacesChanged}
            options={searchOptions}
        >
            <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-transparent text-sm placeholder-neutral-400 focus:outline-none text-white"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </StandaloneSearchBox>
    );
};

export default LocationSearchInput;
