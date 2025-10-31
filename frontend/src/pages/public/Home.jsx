import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProperties } from '../../services/propertyService';
import PropertyCard from '../../components/properties/PropertyCard';

const Home = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        setProperties(response.data.slice(0, 3)); // Take first 3 properties for featured section
      } catch (error) {
        console.error('Failed to fetch properties', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section id="home" className="relative">
      <div className="relative isolate">
        <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2000&auto=format&fit=crop" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="bg-gradient-to-b from-white via-white/90 to-white -z-10 absolute top-0 right-0 bottom-0 left-0"></div>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="sm:text-5xl text-4xl font-semibold text-slate-900 tracking-tight">Find Your Perfect Offbeat Getaway</h1>
            <p className="sm:text-lg text-base text-slate-600 mt-4">Connect with local hosts in rural, less-traveled places. Each booking supports community-led, sustainable tourism.</p>
          </div>

          {/* Search Card */}
          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
            <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-4">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <input type="text" placeholder="Where to?" className="w-full border-0 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none" />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                <input type="text" placeholder="Dates" className="w-full border-0 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none" />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>
                <input type="number" min="1" placeholder="Guests" className="w-full border-0 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none" />
              </div>
              <Link to="/explore" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
                Search
              </Link>
            </div>
          </div>

          {/* Featured categories */}
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-4">
            <button className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white">
              <img src="https://images.unsplash.com/photo-1501884428012-aa321a256730?q=80&w=1200&auto=format&fit=crop" alt="" className="h-28 w-full object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-2 left-2 text-white">
                <p className="text-base font-medium tracking-tight">Mountains</p>
                <p className="text-xs/5 text-white/80">Quiet, scenic retreats</p>
              </div>
            </button>
            <button className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white">
              <img src="https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop" alt="" className="h-28 w-full object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-2 left-2 text-white">
                <p className="text-base font-medium tracking-tight">Riverside</p>
                <p className="text-xs/5 text-white/80">Stay by the water</p>
              </div>
            </button>
            <button className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white">
              <img src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop" alt="" className="h-28 w-full object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-2 left-2 text-white">
                <p className="text-base font-medium tracking-tight">Farms</p>
                <p className="text-xs/5 text-white/80">Agri-stays & barns</p>
              </div>
            </button>
            <button className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white">
              <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop" alt="" className="h-28 w-full object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-2 left-2 text-white">
                <p className="text-base font-medium tracking-tight">Minimal</p>
                <p className="text-xs/5 text-white/80">Clean, modern cabins</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Featured listings */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Featured stays</h2>
          <Link to="/explore" className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 text-slate-600">
            Explore all
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map(property => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;