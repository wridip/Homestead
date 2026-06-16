import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProperties } from '../../services/propertyService';
import PropertyCard from '../../components/properties/PropertyCard';
import PropertyCardSkeleton from '../../components/properties/PropertyCardSkeleton';
import Modal from '../../components/common/Modal';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useGoogleMapsLoader } from '../../context/GoogleMapsLoaderContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { mapId } from '../../config/googleMaps';

const Explore = () => {
  const [properties, setProperties] = useState([]); // The master list from the server
  const [filteredProperties, setFilteredProperties] = useState([]); // The list to be rendered
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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

  const handleMarkerInteraction = (propertyId) => {
    setHoveredProperty(propertyId);
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const activeFiltersCount = (filters.type.length > 0 ? 1 : 0) + (filters.price < 10000 ? 1 : 0);

  // Calculate dynamic map center based on filtered properties
  const mapCenter = filteredProperties.length > 0 && filteredProperties[0].location?.coordinates
    ? { lat: filteredProperties[0].location.coordinates[1], lng: filteredProperties[0].location.coordinates[0] }
    : { lat: 20.5937, lng: 78.9629 }; // Default India center

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-destructive">Error: {error}</div>;
  }

  return (
    <div className="bg-background text-foreground flex flex-col md:flex-row min-h-[calc(100vh-64px)] overflow-hidden">

      {/* Left Pane: Scrolling List (approx 60%) */}
      <div className="w-full md:w-[60%] flex flex-col h-[calc(100vh-64px)] border-r border-border relative">    

        {/* Horizontal Filters Bar (Sticky) */}
        <div className="py-4 px-6 lg:px-10 bg-background/95 backdrop-blur-xl border-b border-border sticky top-0 z-20">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-serif text-foreground tracking-tight">
                {loading ? (
                  <div className="h-8 w-32 bg-muted animate-pulse rounded-md" />
                ) : (
                  <><span className="italic text-primary font-medium">{filteredProperties.length}</span> results</>
                )}
              </h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all shadow-sm hover:shadow-md ${activeFiltersCount > 0 ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border text-foreground hover:bg-muted/50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="2" y1="14" x2="6" y2="14"></line><line x1="10" y1="8" x2="14" y2="8"></line><line x1="18" y1="16" x2="22" y2="16"></line></svg>
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </button>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-card border border-border text-foreground py-2 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium shadow-sm transition-all cursor-pointer hover:bg-muted/50"
                  >
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Top Rated</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-primary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search by name or address..."
                className="w-full bg-card border border-border rounded-full py-2.5 pl-11 pr-4 text-sm text-foreground placeholder-muted-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm hover:border-primary/30"
              />
            </div>
          </div>
        </div>

        {/* Filter Modal */}
        <Modal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          title="Refine your search"
        >
          <div className="space-y-8 py-4">
            <section>
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Property Type</h4>
              <div className="flex flex-wrap gap-2">
                {['Mountain', 'Riverside', 'Farm', 'Forest', 'Village'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeFilter(type)}
                    className={`px-5 py-2.5 text-xs font-bold rounded-full border transition-all duration-300 ${filters.type.includes(type) ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-primary'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Price Range</h4>
                <span className="text-sm font-serif italic text-primary font-bold">Up to ₹{filters.price.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={filters.price}
                onChange={(e) => setFilters(prev => ({...prev, price: parseInt(e.target.value)}))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"      
              />
              <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                <span>₹500</span>
                <span>₹10,000+</span>
              </div>
            </section>

            <div className="pt-6 border-t border-border flex justify-between items-center">
              <button
                onClick={resetFilters}
                className="text-xs text-muted-foreground font-bold hover:text-foreground transition-colors underline underline-offset-4"
              >
                Clear all
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-xs font-bold shadow-lg hover:bg-primary/90 transition-all active:scale-95"
              >
                Show {filteredProperties.length} results
              </button>
            </div>
          </div>
        </Modal>

        {/* Scrollable Properties List */}
        <div id="property-list" className="flex-1 overflow-y-auto scrollbar-hide p-6 lg:p-10 pb-32 scroll-smooth">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              {[...Array(6)].map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              {filteredProperties.map((property, idx) => (
                <motion.div
                  key={property._id}
                  id={`property-${property._id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx % 4 * 0.1, duration: 0.5 }}
                  onMouseEnter={() => setHoveredProperty(property._id)}
                  onMouseLeave={() => setHoveredProperty(null)}
                  className={`h-full group rounded-2xl transition-all duration-500 ${hoveredProperty === property._id ? 'ring-2 ring-primary ring-offset-4 ring-offset-background' : ''}`}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 lg:p-10 max-w-4xl mx-auto">
               <div className="w-16 h-16 rounded-full bg-muted/30 border border-border flex items-center justify-center mb-6 shadow-inner">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/60"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
               </div>
              <h3 className="text-2xl font-serif text-foreground">No matches found</h3>
              <p className="mt-2 text-muted-foreground text-sm text-center">We couldn't find any stays matching your current filters. Try broadening your search or resetting all filters.</p>
              <button
                onClick={resetFilters}
                className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-full text-xs font-bold shadow-lg hover:bg-primary/90 transition-all active:scale-95"
              >
                Reset Search
              </button>

              {/* Suggestions Section */}
              {properties.length > 0 && (
                <div className="mt-16 w-full border-t border-border pt-12">
                  <h4 className="text-lg font-serif mb-6 flex items-center gap-2">
                    <span className="text-primary font-bold">✨</span> Suggested for you
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-80">
                    {properties
                      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
                      .slice(0, 2)
                      .map(p => (
                        <div key={p._id} className="scale-95 hover:scale-100 transition-transform">
                          <PropertyCard property={p} />
                        </div>
                      ))}
                  </div>
                </div>
              )}
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
          {isLoaded && !loading ? (
            <Map
              mapId={mapId}
              defaultCenter={mapCenter}
              defaultZoom={6}
              disableDefaultUI={true}
              zoomControl={true}
              colorScheme="DARK"
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
                      onClick={() => handleMarkerInteraction(property._id)}
                    >
                      <div 
                        onMouseEnter={() => setHoveredProperty(property._id)}
                        onMouseLeave={() => setHoveredProperty(null)}
                        className={`px-2.5 py-1.5 rounded-full border shadow-lg transition-all duration-300 font-bold text-xs flex items-center justify-center whitespace-nowrap cursor-pointer ${
                          isHovered 
                          ? 'bg-primary text-primary-foreground border-primary scale-110 -translate-y-1 z-50' 
                          : 'bg-card text-foreground border-border hover:border-primary/50'
                        }`}
                      >
                        ₹{(property.baseRate || 0).toLocaleString()}
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