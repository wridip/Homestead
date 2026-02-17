import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../../services/propertyService';
import PropertyCard from '../../components/properties/PropertyCard';

const Explore = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for the filter controls themselves
  const [searchInputValue, setSearchInputValue] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    type: searchParams.getAll('type') || [],
    price: searchParams.get('price') || 3000,
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Recommended');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        // Ensure we fetch all results that match the criteria
        params.set('limit', -1);
        
        const response = await getProperties(params);
        setProperties(response.data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchProperties();
  }, [searchParams]);

  // This function will be called when the user interacts with filters
  const handleFilterChange = () => {
    const newParams = new URLSearchParams();

    if (searchInputValue) {
      newParams.set('search', searchInputValue);
    }
    if (sortBy !== 'Recommended') {
      newParams.set('sort', sortBy);
    }
    if (filters.price < 3000) {
      newParams.set('price_lte', filters.price);
    }
    filters.type.forEach(t => newParams.append('type', t));

    setSearchParams(newParams);
  };
  
  // A specific handler for the text input to update its own state
  const handleSearchInputChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  // A handler to trigger the search when the user clicks a button or presses enter
  const triggerSearch = () => {
    handleFilterChange();
  };

  const handleTypeFilter = (type) => {
    const newTypeFilters = filters.type.includes(type)
      ? filters.type.filter(t => t !== type)
      : [...filters.type, type];
    
    setFilters(prev => ({...prev, type: newTypeFilters}));
    // We can decide to trigger search immediately on checkbox click
    // Or wait for a button. For now, let's make it immediate.
    const newParams = new URLSearchParams(searchParams);
    if (newTypeFilters.length > 0) {
      newParams.delete('type');
      newTypeFilters.forEach(t => newParams.append('type', t));
    } else {
      newParams.delete('type');
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchInputValue('');
    setFilters({ type: [], region: 'All regions', price: 3000 });
    setSortBy('Recommended');
    setSearchParams(new URLSearchParams());
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
                      value={searchInputValue}
                      onChange={handleSearchInputChange}
                      placeholder="e.g., 'Lachung'"
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