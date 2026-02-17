import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { getProperties } from '../../services/propertyService';
import { getPhotos, deletePhoto } from '../../services/photoService';
import PropertyCard from '../../components/properties/PropertyCard';
import { PhotoCard } from '../../components/properties/PhotoCard';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../assets/datepicker-custom.css";
import LocationSearchInput from '../../components/search/LocationSearchInput';
import GuestSelector from '../../components/search/GuestSelector';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [featuredProperty, setFeaturedProperty] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const handleDeletePhoto = async (photoId) => {
    try {
      await deletePhoto(photoId);
      setPhotos(photos.filter(photo => photo._id !== photoId));
      console.log('Photo deleted successfully:', photoId);
    } catch (error) {
      console.error('Failed to delete photo', error);
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        const firstThree = response.data.slice(0, 3);
        setProperties(firstThree);
        if (firstThree.length > 0) {
          setFeaturedProperty(firstThree[0]);
        }
      } catch (error) {
        console.error('Failed to fetch properties', error);
      }
    };

      const fetchPhotos = async () => {
        try {
          const response = await getPhotos();
          setPhotos(response.data);
        } catch (error) {
          console.error('Failed to fetch photos', error);
        }
      };
    
      fetchProperties();
      fetchPhotos();
    }, []);

  useEffect(() => {
    const animateEls = Array.from(document.querySelectorAll('[data-animate]'));

    const initAnimate = () => {
      animateEls.forEach(el => {
        el.classList.add('opacity-0', 'translate-y-2', 'transition', 'duration-700');
      });
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.remove('opacity-0', 'translate-y-2');
            e.target.classList.add('opacity-100', 'translate-y-0');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      animateEls.forEach(el => io.observe(el));
    };

    initAnimate();
  }, []);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) {
      params.append('search', location);
    }
    if (startDate) {
      params.append('startDate', startDate.toISOString());
    }
    if (endDate) {
      params.append('endDate', endDate.toISOString());
    }
    if (guests) {
      params.append('guests', guests);
    }
    navigate(`/explore?${params.toString()}`);
  };


  return (
    <main id="home">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/web.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl tracking-tight font-medium text-white" data-animate>Find Your Perfect Offbeat Getaway</h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-200" data-animate>Connect with local hosts in rural, less-traveled places. Each booking supports community-led, sustainable tourism.</p>
          
          {/* Search Card */}
          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-neutral-800 bg-transparent shadow-lg backdrop-blur-sm" data-animate>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3">
              <div className="flex items-center gap-2 rounded-lg bg-transparent px-3 py-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#BB86FC]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#BB86FC]"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <LocationSearchInput value={location} onChange={handleLocationChange} placeholder="Where to?" />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-transparent px-3 py-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#BB86FC]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#BB86FC]"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  popperPlacement="bottom-start"
                  placeholderText="Dates"
                  className="placeholder-neutral-400 focus:outline-none text-sm bg-transparent w-full text-white"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg .bg-transparent px-3 py-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#BB86FC]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#BB86FC]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>
                <GuestSelector guests={guests} setGuests={setGuests} />
              </div>
              <button onClick={handleSearch} className="btn-adaptive rounded-lg px-4 py-2 text-center text-sm font-semibold border flex items-center justify-center gap-2 text-white bg-purple-600 border-purple-600 hover:bg-purple-500 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured stays */}
      <section id="featured" data-bg="dark" className="scroll-mt-16 bg-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between" data-animate>
            <h2 className="text-2xl tracking-tight font-medium text-neutral-200">Featured stays</h2>
            <Link to="/explore" className="btn-adaptive rounded-md px-3 py-1.5 text-sm font-medium border inline-flex items-center gap-2 text-neutral-200 border-neutral-700 hover:bg-neutral-800">
              Explore all
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-neutral-800 pt-14 pb-14 bg-transparent" data-bg="dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center" data-animate>
            <h2 className="text-3xl tracking-tight font-medium text-neutral-200">Plan with purpose</h2>
            <p className="mt-3 text-sm text-neutral-400">Every step is built around safety, trust, and local impact.</p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border-neutral-800 bg-[#1E1E1E] p-5 hover:border-neutral-700 transition-all duration-300" data-animate>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border-neutral-800 bg-[#121212]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#BB86FC]"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path><circle cx="12" cy="12" r="10"></circle></svg>
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight text-neutral-200">Discover</h3>
              <p className="mt-1 text-sm text-neutral-400">Find handpicked, offbeat stays verified for authenticity and sustainability.</p>
            </div>
            <div className="rounded-xl border-neutral-800 bg-[#1E1E1E] p-5 hover:border-neutral-700 transition-all duration-300" data-animate>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border-neutral-800 bg-[#121212]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#BB86FC]"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight text-neutral-200">Book securely</h3>
              <p className="mt-1 text-sm text-neutral-400">Protected payments, clear policies, and responsive host support.</p>
            </div>
            <div className="rounded-xl border-neutral-800 bg-[#1E1E1E] p-5 hover:border-neutral-700 transition-all duration-300" data-animate>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border-neutral-800 bg-[#121212]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#BB86FC]"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight text-neutral-200">Travel responsibly</h3>
              <p className="mt-1 text-sm text-neutral-400">Support local livelihoods and low-impact travel practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Photo Wall */}
      <section className="pt-14 pb-14 bg-transparent" data-bg="dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center" data-animate>
            <h2 className="text-3xl tracking-tight font-medium text-neutral-200">Community Photo Wall</h2>
            <p className="mt-3 text-sm text-neutral-400">Post your favorite moments from your trip or homestay. Tag #Homestead and share them here.</p>
            <div className="mt-4 flex justify-center">
              <Link to="/share-photo" className="btn-adaptive rounded-md px-4 py-2 text-sm font-semibold border inline-flex items-center gap-2 text-neutral-200 border-neutral-700 hover:bg-neutral-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M16 5h6"></path><path d="M19 2v6"></path><path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"></path><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path><circle cx="9" cy="9" r="2"></circle></svg>
                Share your photo
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <PhotoCard key={photo._id || index} photo={photo} onDelete={handleDeletePhoto} />
            ))}
          </div>
        </div>
      </section>

      {/* Host CTA */}
      <section data-bg="dark" className="overflow-hidden border-y border-neutral-800 pt-16 pb-16 relative bg-transparent" id="host">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background:radial-gradient(800px_400px_at_50%_-30%,#BB86FC,transparent_60%)]"></div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 items-center gap-8 px-4 sm:px-6 lg:px-8">
          <div data-animate>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset bg-purple-600/10 text-purple-400 ring-purple-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="m11 17 2 2a1 1 0 1 0 3-3"></path><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"></path><path d="m21 3 1 11h-2"></path><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"></path><path d="M3 4h8"></path></svg>
              Host with Homestead
            </span>
            <h3 className="mt-3 text-3xl tracking-tight font-medium text-neutral-200">Share your space, empower your community</h3>
            <p className="mt-3 text-sm text-neutral-400">List your homestay with transparent terms, fair payouts, and guidance on eco-friendly operations.</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-200">
              <li className="inline-flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-purple-400"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                Zero-cost onboarding and photography guidance
              </li>
              <li className="inline-flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-purple-400"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                Tools to manage bookings, pricing, and availability
              </li>
              <li className="inline-flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-purple-400"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                Sustainability playbook and certification support
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/signup" className="btn-adaptive rounded-md px-4 py-2 text-sm font-semibold border inline-flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg>
                Become a host
              </Link>
            </div>
          </div>
          <div className="relative" data-animate>
            {featuredProperty ? (
              <>
                <div className="overflow-hidden rounded-2xl border-neutral-800 shadow-sm">
                  <img src={`http://localhost:5000${featuredProperty.images[0]}`} alt={featuredProperty.name} className="h-80 w-full object-cover" />
                </div>
                <div className="hidden sm:block -bottom-4 -left-4 bg-[#1E1E1E] border-neutral-800 border rounded-xl pt-3 pr-3 pb-3 pl-3 absolute shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-neutral-800">
                      <img src={featuredProperty.hostId.profilePicture || 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80'} alt={`${featuredProperty.hostId.name}'s avatar`} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-medium leading-4 text-neutral-200">
                        {featuredProperty.hostId.name} • Host
                      </p>
                      <p className="text-[11px] text-neutral-400 leading-4">Host since {new Date(featuredProperty.hostId.createdAt).getFullYear()}</p>
                    </div>
                    <div className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-neutral-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-neutral-200"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                      {featuredProperty.averageRating || 'New'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="overflow-hidden rounded-2xl border-neutral-800 shadow-sm">
                  <img src="https://images.unsplash.com/photo-1600585153490-76fb20a32601?q=80&w=1600&auto=format&fit=crop" alt="Host property" className="h-80 w-full object-cover" />
                </div>
                <div className="hidden sm:block -bottom-4 -left-4 bg-[#1E1E1E] border-neutral-800 border rounded-xl pt-3 pr-3 pb-3 pl-3 absolute shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-neutral-800">
                      <img src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80" alt="Priya, Host avatar" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-medium leading-4 text-neutral-200">
                        {isAuthenticated && user && user.role === 'Host' ? `${user.name} • Host` : 'Priya • Host'}
                      </p>
                      <p className="text-[11px] text-neutral-400 leading-4">Since 2021</p>
                    </div>
                    <div className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-neutral-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-neutral-200"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                      4.9
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
