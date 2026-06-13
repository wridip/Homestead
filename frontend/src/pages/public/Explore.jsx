import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../../services/propertyService';
import PropertyCard from '../../components/properties/PropertyCard';
import { GoogleMap, AdvancedMarker } from '@react-google-maps/api';
import { useGoogleMapsLoader } from '../../context/GoogleMapsLoaderContext.jsx';
import { motion } from 'framer-motion';
import { mapId } from '../../config/googleMaps';

const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#171d19' }] }, // card background
  { elementType: 'labels.text.stroke', stylers: [{ color: '#111613' }] }, // main background
  { elementType: 'labels.text.fill', stylers: [{ color: '#96a69a' }] }, // muted-foreground
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#111613' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a241e' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a241e' }] },
];

const Explore = () => {
  const [properties, setProperties] = useState([]); // The master list from the server
  const [filteredProperties, setFilteredProperties] = useState([]); // The list to be rendered
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);

  const [searchParams] = useSearchParams();
  const { isLoaded } = useGoogleMapsLoader();

  // State for client-side filter controls
  const [searchQuery, setSearchQuery] = useState(''); // For the text input on this page
  const [filters, setFilters] = useState({
    type: [],
    price: 3000,
  });
  const [sortBy, setSortBy] = useState('Recommended');

  // Step 1: Fetch the base list of properties from the server
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const location = searchParams.get('location');
        const params = { limit: -1 };
        if (location) {
          params.location = location;
          // Set the client-side search box to match the initial search
          setSearchQuery(location);
        }
        
        const response = await getProperties(params);
        const propertyData = Array.isArray(response) ? response : response?.data;

        if (Array.isArray(propertyData)) {
          setProperties(propertyData);
        } else {
          console.error("Fetched properties data is not an array:", propertyData);
          setProperties([]);
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchProperties();
  }, [searchParams]);

  // Step 2: Apply all client-side filters whenever the master list or filters change
  useEffect(() => {
    let result = properties;

    // Apply text search on name or address (client-side)
    // Only apply if searchQuery is DIFFERENT from the initial location param to allow broader search
    const initialLocation = searchParams.get('location');
    if (searchQuery && searchQuery !== initialLocation) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.address && p.address.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply type filters
    if (filters.type.length > 0) {
      result = result.filter(p => filters.type.includes(p.type));
    }
    
    // Apply price filter
    if (filters.price) {
      result = result.filter(p => p.baseRate <= filters.price);
    }

    // Apply sorting
    let sortedProperties = [...result];
    if (sortBy === 'Price: Low to High') {
      sortedProperties.sort((a, b) => a.baseRate - b.baseRate);
    } else if (sortBy === 'Price: High to Low') {
      sortedProperties.sort((a, b) => b.baseRate - a.baseRate);
    } else if (sortBy === 'Top Rated') {
      sortedProperties.sort((a, b) => b.averageRating - a.averageRating);
    }

    setFilteredProperties(sortedProperties);

  }, [searchQuery, filters, sortBy, properties]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const handleTypeFilter = (type) => {
    setFilters(prevFilters => {
      const newTypeFilters = prevFilters.type.includes(type) 
        ? prevFilters.type.filter(t => t !== type) 
        : [...prevFilters.type, type];
      return { ...prevFilters, type: newTypeFilters };
    });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      type: [],
      price: 3000,
    });
    setSortBy('Recommended');
  };

  // Calculate dynamic map center based on filtered properties
  const mapCenter = filteredProperties.length > 0 && filteredProperties[0].location?.coordinates
    ? { lat: filteredProperties[0].location.coordinates[1], lng: filteredProperties[0].location.coordinates[0] }
    : { lat: 20.5937, lng: 78.9629 }; // Default India center

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary animate-pulse"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path><circle cx="12" cy="12" r="10"></circle></svg>
          <span className="text-muted-foreground font-serif italic tracking-widest text-sm">Finding escapes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-destructive">Error: {error}</div>;
  }

  return (
    <div className="bg-background text-foreground flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      
      {/* Left Pane: Scrolling List (approx 60%) */}
      <div className="w-full md:w-[60%] flex flex-col h-[calc(100vh-64px)] overflow-hidden border-r border-border">
        
        {/* Horizontal Filters Bar (Sticky) */}
        <div className="py-6 px-6 lg:px-10 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-10 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-serif text-foreground tracking-tight"><span className="italic text-primary">{filteredProperties.length}</span> stays found</h1>
             <div className="relative w-full sm:w-auto">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full sm:w-auto bg-card border border-border text-foreground py-2.5 pl-5 pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium shadow-sm transition-all cursor-pointer"
              >
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search destination..."
                  className="w-full bg-card border border-border rounded-full py-2.5 pl-11 pr-4 text-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
                />
             </div>

             <div className="flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2 shadow-sm">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Max ₹{filters.price}</span>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={filters.price}
                  onChange={(e) => setFilters(prev => ({...prev, price: e.target.value}))}
                  className="w-24 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
             </div>
             
             {['Mountain', 'Riverside', 'Farm'].map(type => (
                <button 
                  key={type} 
                  onClick={() => handleTypeFilter(type)} 
                  className={`px-5 py-2 text-xs font-semibold rounded-full border transition-all shadow-sm ${filters.type.includes(type) ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/50'}`}
                >
                  {type}
                </button>
             ))}

             {(filters.type.length > 0 || searchQuery || filters.price < 3000) && (
               <button onClick={resetFilters} className="text-xs text-primary font-bold hover:underline underline-offset-2 ml-2">Clear filters</button>
             )}
          </div>
        </div>

        {/* Scrollable Properties List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 lg:p-10 pb-32 scroll-smooth">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {filteredProperties.map((property, idx) => (
                <motion.div 
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onMouseEnter={() => setHoveredProperty(property._id)}
                  onMouseLeave={() => setHoveredProperty(null)}
                  className="h-full"
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
               <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4 shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
               </div>
              <h3 className="text-2xl font-serif text-foreground">No escapes found</h3>
              <p className="mt-3 text-base text-muted-foreground">Try adjusting your filters or exploring a different location.</p>
              <button onClick={resetFilters} className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">Reset all filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Sticky Interactive Map (approx 40%) */}
      <div className="hidden md:block w-[40%] bg-background p-6 lg:p-8 sticky top-16 h-[calc(100vh-64px)] z-0">
        <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border border-border">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={6}
              options={{
                mapId: mapId,
                styles: mapStyles,
                disableDefaultUI: true,
                zoomControl: true,
              }}
            >
              {filteredProperties.map(property => {
                if (property.location && property.location.coordinates) {
                  const isHovered = hoveredProperty === property._id;
                  return (
                    <AdvancedMarker 
                      key={property._id}
                      position={{ lat: property.location.coordinates[1], lng: property.location.coordinates[0] }}
                      zIndex={isHovered ? 100 : 1}
                    >
                      <div style={{
                        color: isHovered ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                        transform: `scale(${isHovered ? 1.5 : 1.2})`,
                        transition: 'transform 0.2s ease-in-out',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          stroke="hsl(var(--background))" 
                          strokeWidth="2"
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </div>
                    </AdvancedMarker>
                  );
                }
                return null;
              })}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-card">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary animate-pulse mb-4"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span className="text-muted-foreground font-serif italic tracking-widest text-sm">Loading map...</span>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Explore;