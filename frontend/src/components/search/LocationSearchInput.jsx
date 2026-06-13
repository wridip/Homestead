import React, { useRef, useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useGoogleMapsLoader } from '../../context/GoogleMapsLoaderContext';

const searchOptions = {
    types: ['(cities)'],
    componentRestrictions: { country: "in" }, // Example: Restrict to India
    fields: ['formatted_address', 'geometry', 'name']
};


const LocationSearchInput = ({ value, onChange, placeholder }) => {
    const { isLoaded, loadError } = useGoogleMapsLoader();
    const inputRef = useRef(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const placesLibrary = useMapsLibrary('places');

    useEffect(() => {
        if (!placesLibrary || !inputRef.current) return;

        const newAutocomplete = new placesLibrary.Autocomplete(inputRef.current, searchOptions);
        setAutocomplete(newAutocomplete);

        return () => {
            if (newAutocomplete && window.google) {
                window.google.maps.event.clearInstanceListeners(newAutocomplete);
            }
        };
    }, [placesLibrary]);

    useEffect(() => {
        if (!autocomplete || !window.google) return;

        const listener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place && place.formatted_address) {
                onChange(place.formatted_address);
            }
        });

        return () => {
            window.google.maps.event.removeListener(listener);
        };
    }, [autocomplete, onChange]);

    if (loadError) {
        return <div>Error loading maps. Please check your API key and configuration.</div>;
    }

    return (
        <input
            ref={inputRef}
            type="text"
            placeholder={isLoaded ? placeholder : "Loading search..."}
            className="w-full bg-transparent text-sm placeholder-neutral-400 focus:outline-none text-white"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={!isLoaded}
        />
    );
};

export default LocationSearchInput;
