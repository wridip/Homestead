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
    region: '',
    price: 3000,
    eco: '',
    startDate: null,
    endDate: null,
    guests: null,
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const location = searchParams.get('location');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const guests = searchParams.get('guests');

    if (location) {
      setSearchQuery(location);
    }
    setFilters(prevFilters => ({
      ...prevFilters,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      guests: guests ? parseInt(guests) : null,
    }));
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

    if (filters.region) {
      // This is a placeholder for region filtering. The property model needs a region field.
      // For now, it does nothing.
    }

    if (filters.price) {
      result = result.filter(p => p.baseRate <= filters.price);
    }

    if (filters.eco) {
      // This is a placeholder for eco filtering. The property model needs an eco field.
      // For now, it does nothing.
    }

    if (filters.guests) {
      // Assuming property model has a maxGuests field
      result = result.filter(p => p.maxGuests >= filters.guests);
    }

    // TODO: Implement date-based filtering. This requires checking for booking conflicts.

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
      region: '',
      price: 3000,
      eco: '',
      startDate: null,
      endDate: null,
      guests: null,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section id="explore">
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Explore stays</h1>
              <p className="mt-1 text-sm text-slate-600">Curated homestays with a focus on sustainability and local impact.</p>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 sm:w-80">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
                <input id="searchInput" type="text" placeholder="Search for properties..." className="w-full border-0 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <button id="resetBtn" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={resetFilters}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => handleTypeFilter('Mountain')} className={`filter-chip inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium hover:border-slate-300 ${filters.type.includes('Mountain') ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>Mountain</button>
              <button onClick={() => handleTypeFilter('Riverside')} className={`filter-chip inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium hover:border-slate-300 ${filters.type.includes('Riverside') ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path></svg>Riverside</button>
              <button onClick={() => handleTypeFilter('Farm')} className={`filter-chip inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium hover:border-slate-300 ${filters.type.includes('Farm') ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M2 22 16 8"></path><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"></path><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"></path><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"></path><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"></path><path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"></path><path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"></path><path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1 4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"></path></svg>Farm</button>
              <button onClick={() => handleTypeFilter('Minimal')} className={`filter-chip inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium hover:border-slate-300 ${filters.type.includes('Minimal') ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>Minimal</button>
              <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M10 5H3"></path><path d="M12 19H3"></path><path d="M14 3v4"></path><path d="M16 17v4"></path><path d="M21 12h-9"></path><path d="M21 19h-5"></path><path d="M21 5h-7"></path><path d="M8 10v4"></path><path d="M8 12H3"></path></svg>Filters</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-400"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path><path d="M15 5.764v15"></path><path d="M9 3.236v15"></path></svg>
                <select id="regionSelect" className="w-full appearance-none border-0 bg-transparent text-sm text-slate-900 focus:outline-none" value={filters.region} onChange={e => handleFilterChange('region', e.target.value)}>
                  <option value="">All regions</option>
                  <option value="north">North</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                  <option value="south">South</option>
                </select>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-400"><path d="M6 3h12"></path><path d="M6 8h12"></path><path d="m6 13 8.5 8"></path><path d="M6 13h3"></path><path d="M9 13c6.667 0 6.667-10 0-10"></path></svg>
                <div className="w-full">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>₹<span>500</span></span>
                    <span>₹<span id="maxPriceLabel">{filters.price}</span></span>
                  </div>
                  <input id="priceRange" type="range" min="500" max="3000" step="100" value={filters.price} className="mt-1 w-full" onChange={e => handleFilterChange('price', e.target.value)} style={{ '--tw-range': `${((filters.price - 500) / (3000 - 500)) * 100}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-500"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
                <select id="ecoSelect" className="w-full appearance-none border-0 bg-transparent text-sm text-slate-900 focus:outline-none" value={filters.eco} onChange={e => handleFilterChange('eco', e.target.value)}>
                  <option value="">Sustainability</option>
                  <option value="certified">Eco+ Certified</option>
                  <option value="community">Community-led</option>
                  <option value="plastic-free">Plastic-free</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredProperties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-600">Showing {filteredProperties.length} of {properties.length}</p>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6"></path></svg>
                Prev
              </button>
              <button className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m9 18 6-6-6-6"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Explore;
