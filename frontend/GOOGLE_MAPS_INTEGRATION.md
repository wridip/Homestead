## Integrating Google Maps for Each Property

This guide will walk you through the process of integrating Google Maps into the property details page of your application.

### 1. Obtain a Google Maps API Key

To use the Google Maps API, you need to have an API key. Follow these steps to get one:

1.  **Go to the Google Cloud Console:** [https://console.cloud.google.com/](https://console.cloud.google.com/)
2.  **Create a new project** or select an existing one.
3.  **Enable the "Maps JavaScript API" and the "Places API"** for your project. You can find these in the "APIs & Services" > "Library" section.
4.  **Create a new API key.** Go to "APIs & Services" > "Credentials" and click on "Create credentials" > "API key".
5.  **Restrict your API key.** It is highly recommended to restrict your API key to prevent unauthorized use. You can restrict it by HTTP referrers (your website's domain) and by API (only allow it to be used for the "Maps JavaScript API" and "Places API").

### 2. Add the API Key to Your `.env` File

Once you have your API key, create a `.env` file in the `frontend` directory (if it doesn't exist) and add your actual key:

```
VITE_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
```

### 3. Obtain a Map ID (Required for AdvancedMarker)

The application now uses `AdvancedMarkerElement`, which requires a Map ID to function.

1.  In the Google Cloud Console, navigate to **Google Maps Platform** > **Map Management**.
2.  Click **CREATE MAP ID**.
3.  Enter a name for your Map ID.
4.  For **Map type**, select **JavaScript**.
5.  Choose either **Vector** (recommended for advanced features) or **Raster**.
6.  Click **SAVE**.
7.  Copy the generated **Map ID**.
8.  Open `frontend/src/config/googleMaps.js` and replace `"DEMO_MAP_ID"` with your actual Map ID:

```javascript
export const mapId = "YOUR_MAP_ID";
```

### 4. Using the `@react-google-maps/api` Package

The application is set up to use `AdvancedMarker` for better performance and customization.

*   **Configuration:** The necessary libraries (`places`, `marker`) and the Map ID are configured in `frontend/src/config/googleMaps.js`.

*   **Rendering the map:** The `GoogleMap` component must include the `mapId` in its `options` prop for `AdvancedMarker` to work.

    ```javascript
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '450px' }}
      center={center}
      zoom={15}
      options={{ mapId: mapId }}
    >
      <AdvancedMarker position={center} />
    </GoogleMap>
    ```

*   **Displaying a marker:** The `AdvancedMarker` component is used instead of the deprecated `Marker`. It can also accept custom HTML/SVG children for styling.

### 5. Implement Search Autocomplete

To provide location suggestions as the user types in the search bar, you can use the Google Places Autocomplete service. The `@react-google-maps/api` package provides a `Autocomplete` component that makes it easy to add this functionality.

Here's an example of how you can use the `Autocomplete` component in your `frontend/src/pages/public/Home.jsx` file:

```javascript
import { Autocomplete } from '@react-google-maps/api';

// ...

const [autocomplete, setAutocomplete] = useState(null);

const onLoad = (autocomplete) => {
  setAutocomplete(autocomplete);
};

const onPlaceChanged = () => {
  if (autocomplete !== null) {
    const place = autocomplete.getPlace();
    setLocation(place.formatted_address);
  } else {
    console.log('Autocomplete is not loaded yet!');
  }
};

// ...

<Autocomplete
  onLoad={onLoad}
  onPlaceChanged={onPlaceChanged}
>
  <input
    type="text"
    placeholder="Where to?"
    className="w-full bg-transparent text-sm placeholder-neutral-400 focus:outline-none text-white"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
  />
</Autocomplete>
```

**Explanation:**

1.  **Import the `Autocomplete` component:**
    ```javascript
    import { Autocomplete } from '@react-google-maps/api';
    ```

2.  **Create a state variable to hold the autocomplete instance:**
    ```javascript
    const [autocomplete, setAutocomplete] = useState(null);
    ```

3.  **Implement the `onLoad` and `onPlaceChanged` event handlers:**
    *   The `onLoad` event is fired when the `Autocomplete` component is loaded. You can use this to get the autocomplete instance and store it in the state.
    *   The `onPlaceChanged` event is fired when the user selects a place from the suggestions. You can use this to get the selected place and update the `location` state.

4.  **Wrap your search input with the `Autocomplete` component:**
    ```javascript
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
    >
      <input
        type="text"
        placeholder="Where to?"
        // ...
      />
    </Autocomplete>
    ```

By following these steps, you can add location autocomplete to your search bar, providing a better user experience and more accurate search results.
