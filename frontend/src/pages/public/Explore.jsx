import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../../services/propertyService';
import PropertyCard from '../../components/properties/PropertyCard';

const Explore = () => {
  const [properties, setProperties] = useState([]); // The master list from the server
  const [filteredProperties, setFilteredProperties] = useState([]); // The list to be rendered
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();

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
    if (searchQuery) {
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

  const triggerSearch = () => {
    // This function can be used to explicitly trigger a search if needed
    // For now, client-side filtering happens automatically when searchQuery changes
    // But if we ever moved to server-side search on button click, this would be the place.
    console.log("Triggering search with:", searchQuery);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      type: [],
      price: 3000,
    });
    setSortBy('Recommended');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-neutral-900 text-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters column */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="p-6 bg-neutral-800 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-neutral-100">Filters</h2>
              <div className="space-y-6">
                {/* Search input */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-neutral-300 mb-2">Search by name or location</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="search"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      placeholder="e.g., 'Mountain cabin' or 'Lachung'"
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-lg py-2.5 px-4 text-white placeholder-neutral-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                    <button onClick={triggerSearch} className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
                    </button>
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-neutral-300 mb-2">Price per night</label>
                  <div className="flex justify-between text-sm text-neutral-400 mb-1">
                    <span>₹500</span>
                    <span>₹{filters.price}</span>
                  </div>
                  <input
                    type="range"
                    id="price"
                    min="500"
                    max="3000"
                    value={filters.price}
                    onChange={(e) => setFilters(prev => ({...prev, price: e.target.value}))}
                    onMouseUp={handleFilterChange}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-300 mb-2">Property Type</h3>
                  <div className="space-y-2">
                    {['Mountain', 'Riverside', 'Farm', 'Minimal'].map(type => (
                      <div key={type} className="flex items-center">
                        <input id={`type-${type}`} name="type" type="checkbox" checked={filters.type.includes(type)} onChange={() => handleTypeFilter(type)} className="h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-purple-600 focus:ring-purple-500" />
                        <label htmlFor={`type-${type}`} className="ml-3 text-sm text-neutral-300">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button onClick={resetFilters} className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-purple-500">
                  Reset Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Properties grid */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8">
              <h1 className="text-4xl font-extrabold text-neutral-100 tracking-tight">Explore Properties</h1>
               <div className="relative">
                <select 
                  value={sortBy} 
                  onChange={(e) => { setSortBy(e.target.value); handleFilterChange(); }}
                  className="appearance-none w-full sm:w-auto bg-neutral-800 border border-neutral-700 text-white py-2 pl-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                </div>
              </div>
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {properties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-neutral-400">No properties found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;