import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../../services/propertyService';
import PropertyCard from '../../components/properties/PropertyCard';

const Explore = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: [],
    region: 'All regions',
    price: 3000,
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const location = searchParams.get('location');
    if (location) {
      setSearchQuery(location);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        setProperties(response.data);
        setFilteredProperties(response.data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    let result = properties;

    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase())));
    }

    if (filters.type.length > 0) {
      result = result.filter(p => filters.type.some(t => p.amenities.includes(t)));
    }

    if (filters.region && filters.region !== 'All regions') {
      result = result.filter(p => p.region === filters.region);
    }

    if (filters.price) {
      result = result.filter(p => p.baseRate <= filters.price);
    }

    setFilteredProperties(result);

  }, [searchQuery, filters, properties]);

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

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      type: [],
      region: 'All regions',
      price: 3000,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="sm:px-6 max-w-6xl mr-auto ml-auto pr-4 pb-24 pl-4">
      <div className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between">
        <div className="">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">Explore stays</h1>
          <p className="sm:text-base text-sm text-neutral-400 max-w-2xl mt-2">Curated homestays with a focus on sustainability and local impact.</p>
        </div>

        <div className="flex w-full items-center gap-2 md:w-[28rem]">
          <label className="group relative flex w-full items-center rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-neutral-300 focus-within:border-neutral-700">
            <i data-lucide="search" className="mr-2 h-4 w-4 text-neutral-500"></i>
            <input id="searchInput" type="text" placeholder="Search for properties..." className="w-full bg-transparent text-neutral-200 placeholder:text-neutral-500 focus:outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </label>
          <button id="resetBtn" className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-neutral-300 hover:border-neutral-700" onClick={resetFilters}>
            <i data-lucide="rotate-ccw" className="h-4 w-4"></i>
            <span className="">Reset</span>
          </button>
        </div>
      </div>

      <section aria-label="Filters" className="sm:p-6 bg-neutral-900/40 border-neutral-800 border rounded-2xl mb-8 pt-4 pr-4 pb-4 pl-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {['Mountain', 'Riverside', 'Farm', 'Minimal'].map(type => (
                <button key={type} onClick={() => handleTypeFilter(type)} className={`inline-flex gap-2 hover:border-neutral-700 text-sm text-neutral-200 bg-neutral-900/60 border-neutral-800 border rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center ${filters.type.includes(type) ? 'ring-1 ring-violet-500/40 border-violet-500/40 bg-violet-500/10 text-violet-300' : ''}`}>
                  {type}
                </button>
              ))}
            </div>
            <div className="hidden items-center gap-2 text-neutral-400 sm:flex">
              <i data-lucide="sliders-horizontal" className="h-4 w-4"></i>
              <span className="text-sm">Filters</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="relative">
              <select value={filters.region} onChange={e => handleFilterChange('region', e.target.value)} className="flex hover:border-neutral-700 text-sm text-neutral-200 bg-neutral-900/60 w-full border-neutral-800 border rounded-lg pt-2 pr-3 pb-2 pl-3 items-center justify-between">
                <option value="All regions">All regions</option>
                <option value="Himalayas">Himalayas</option>
                <option value="Western Ghats">Western Ghats</option>
                <option value="North-East">North-East</option>
              </select>
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>₹500</span>
                <span className="inline-flex items-center gap-1">
                  <i data-lucide="indian-rupee" className="h-3.5 w-3.5"></i>
                  <span id="priceValue" className="font-medium text-neutral-200">₹{filters.price}</span>
                </span>
              </div>
              <div className="mt-2 rounded-lg border border-neutral-800 bg-neutral-900/60 p-3">
                <input type="range" min="500" max="3000" step="50" value={filters.price} className="w-full cursor-pointer accent-purple-500/90" id="priceRange" onChange={e => handleFilterChange('price', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Results" className="space-y-6">
        {filteredProperties.map(property => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </section>
    </div>
  );
};

export default Explore;