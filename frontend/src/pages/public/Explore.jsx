import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../../services/propertyService';
import PropertyCard from '../../components/properties/PropertyCard';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useGoogleMapsLoader } from '../../context/GoogleMapsLoaderContext.jsx';
import { motion } from 'framer-motion';
import { mapId } from '../../config/googleMaps';

const Explore = () => {
  const [properties, setProperties] = useState([]); // The master list from the server
  const [filteredProperties, setFilteredProperties] = useState([]); // The list to be rendered
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [searchParams] = useSearchParams();
  const { isLoaded } = useGoogleMapsLoader();

  // State for client-side filter controls
  const [searchQuery, setSearchQuery] = useState(''); // For the text input on this page
  const [filters, setFilters] = useState({
    type: [],
    price: 10000,
  });
  const [sortBy, setSortBy] = useState('Recommended');

  // Handle scroll for "Scroll to Top" button
  useEffect(() => {
    const listElement = document.getElementById('property-list');
    if (!listElement) return;

    const handleScroll = () => {
      setShowScrollTop(listElement.scrollTop > 400);
    };

    listElement.addEventListener('scroll', handleScroll);
    return () => listElement.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const listElement = document.getElementById('property-list');
    if (listElement) {
      listElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

    // Apply price filter - Improved logic: ensure rate exists
    if (filters.price) {
      result = result.filter(p => {
        const rate = p.baseRate || 0;
        return rate <= filters.price;
      });
    }

    // Apply sorting
    let sortedProperties = [...result];
    if (sortBy === 'Price: Low to High') {
      sortedProperties.sort((a, b) => (a.baseRate || 0) - (b.baseRate || 0));
    } else if (sortBy === 'Price: High to Low') {
      sortedProperties.sort((a, b) => (b.baseRate || 0) - (a.baseRate || 0));
    } else if (sortBy === 'Top Rated') {
      sortedProperties.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }

    setFilteredProperties(sortedProperties);

  }, [searchQuery, filters, sortBy, properties, searchParams]);

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
      price: 10000,
    });
    setSortBy('Recommended');
    // Clear URL parameters
    navigate('/explore', { replace: true });
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
    <div className="bg-background text-foreground flex flex-col md:flex-row min-h-[calc(100vh-64px)] overflow-hidden">

      {/* Left Pane: Scrolling List (approx 60%) */}
      <div className="w-full md:w-[60%] flex flex-col h-[calc(100vh-64px)] border-r border-border relative">    

        {/* Horizontal Filters Bar (Sticky) */}
        <div className="py-6 px-6 lg:px-10 bg-background/95 backdrop-blur-xl border-b border-border sticky top-0 z-20 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-serif text-foreground tracking-tight">
              <span className="italic text-primary font-medium">{filteredProperties.length}</span> results      
            </h1>
             <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full sm:w-auto bg-card border border-border text-foreground py-2.5 pl-5 pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium shadow-sm transition-all cursor-pointer hover:bg-muted/50"
              >
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="relative flex-1 min-w-[220px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Where to next?"
                  className="w-full bg-card border border-border rounded-full py-2.5 pl-11 pr-4 text-sm text-foreground placeholder-muted-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm hover:border-primary/30"
                />
             </div>

             <div className="flex items-center gap-4 bg-card border border-border rounded-full px-5 py-2 shadow-sm group hover:border-primary/30 transition-colors">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Max Budget</span>
                  <span className="text-xs font-serif italic text-primary font-bold">₹{filters.price.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={filters.price}
                  onChange={(e) => setFilters(prev => ({...prev, price: parseInt(e.target.value)}))}
                  className="w-24 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"      
                />
             </div>

             <div className="flex gap-2">
               {['Mountain', 'Riverside', 'Farm'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeFilter(type)}
                    className={`px-5 py-2.5 text-xs font-bold rounded-full border transition-all duration-300 shadow-sm ${filters.type.includes(type) ? 'bg-primary text-primary-foreground border-primary scale-105' : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-primary hover:bg-primary/5'}`}
                  >
                    {type}
                  </button>
               ))}
             </div>

             {(filters.type.length > 0 || (searchQuery && searchQuery !== searchParams.get('location')) || filters.price < 10000) && (
               <button
                 onClick={resetFilters}
                 className="text-xs text-primary font-bold hover:text-primary/80 transition-colors underline underline-offset-4 decoration-2 decoration-primary/30"
                >
                  Reset all
                </button>
             )}
          </div>
        </div>

        {/* Scrollable Properties List */}
        <div id="property-list" className="flex-1 overflow-y-auto scrollbar-hide p-6 lg:p-10 pb-32 scroll-smooth">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              {filteredProperties.map((property, idx) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx % 4 * 0.1, duration: 0.5 }}
                  onMouseEnter={() => setHoveredProperty(property._id)}
                  onMouseLeave={() => setHoveredProperty(null)}
                  className="h-full group"
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 max-w-md mx-auto">
               <div className="w-20 h-20 rounded-full bg-muted/30 border border-border flex items-center justify-center mb-6 shadow-inner animate-bounce">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/60"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
               </div>
              <h3 className="text-3xl font-serif text-foreground">No matches found</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">We couldn't find any stays matching your current filters. Try broadening your search or resetting all filters.</p>
              <button
                onClick={resetFilters}
                className="mt-10 px-10 py-4 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 hover:-translate-y-1"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="absolute bottom-10 right-10 z-30 p-4 bg-background border border-border rounded-full shadow-2xl text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>  
          </button>
        )}
      </div>

      {/* Right Pane: Sticky Interactive Map (approx 40%) */}
      <div className="hidden md:block w-[40%] bg-background p-6 lg:p-8 sticky top-16 h-[calc(100vh-64px)] z-0"> 
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-border/50 bg-[#0f1410]">
          {isLoaded ? (
            <Map
              mapId={mapId}
              defaultCenter={mapCenter}
              defaultZoom={6}
              disableDefaultUI={true}
              zoomControl={true}
              style={{ width: '100%', height: '100%' }}
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
                      <div className="transition-all duration-300" style={{
                        color: isHovered ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                        transform: `scale(${isHovered ? 1.6 : 1.2})`,
                        filter: isHovered ? 'drop-shadow(0 0 8px hsl(var(--primary)/0.5))' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="#000"
                          strokeWidth="1.5"
                          className="drop-shadow-lg"
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </div>
                    </AdvancedMarker>
                  );
                }
                return null;
              })}
            </Map>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#0f1410]">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/30 animate-pulse mb-4"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span className="text-primary/20 font-serif italic tracking-widest text-sm">Initializing Dark Map...</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Explore;