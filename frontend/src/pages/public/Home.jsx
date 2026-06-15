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
import { getImageUrl } from '../../services/api';

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
      params.append('location', location);
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
          <p className="mt-4 text-base sm:text-lg text-foreground/90" data-animate>Connect with local hosts in rural, less-traveled places. Each booking supports community-led, sustainable tourism.</p>
          
          {/* Search Card */}
          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-background/20 shadow-lg backdrop-blur-sm" data-animate>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3">
              <div className="flex items-center gap-2 rounded-lg bg-transparent px-3 py-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <LocationSearchInput value={location} onChange={handleLocationChange} placeholder="Where to?" />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-transparent px-3 py-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  minDate={new Date()}
                  popperPlacement="bottom-start"
                  placeholderText="Dates"
                  className="placeholder-foreground/50 focus:outline-none text-sm bg-transparent w-full text-foreground"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-transparent px-3 py-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>
                <GuestSelector guests={guests} setGuests={setGuests} />
              </div>
              <button onClick={handleSearch} className="btn-adaptive rounded-lg px-4 py-2 text-center text-sm font-semibold border flex items-center justify-center gap-2 text-primary-foreground bg-primary border-primary hover:bg-opacity-90 transition-all duration-300">
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
            <h2 className="text-2xl tracking-tight font-medium text-foreground">Featured stays</h2>
            <Link to="/explore" className="btn-adaptive rounded-md px-3 py-1.5 text-sm font-medium border inline-flex items-center gap-2 text-foreground border-border hover:bg-accent">
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

      {/* How it works - Bento Grid Redesign */}
      <section className="border-y border-border pt-20 pb-20 bg-background" data-bg="dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12" data-animate>
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl tracking-tighter font-serif text-foreground">Travel with <span className="italic text-primary">Purpose</span></h2>
              <p className="mt-4 text-lg text-muted-foreground font-light">Every step on Homestead is built around safety, trust, and real local impact. Ditch the crowds and discover the untouched.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:grid-rows-2 auto-rows-fr">
            {/* Large Feature Card */}
            <div className="md:col-span-2 md:row-span-2 rounded-3xl border border-border bg-card p-8 sm:p-10 hover:border-primary/40 transition-all duration-500 relative overflow-hidden group shadow-sm" data-animate>
              <div className="absolute -right-8 -top-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background shadow-inner mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-primary"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path><circle cx="12" cy="12" r="10"></circle></svg>
                </div>
                <div>
                  <h3 className="text-3xl font-serif tracking-tight text-foreground mb-4">Discover Hidden Gems</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-light max-w-md">Find handpicked, offbeat stays verified for authenticity and sustainability. From mountain cabins to riverside retreats, experience hospitality rooted in local culture.</p>
                </div>
              </div>
            </div>

            {/* Small Feature Card 1 */}
            <div className="rounded-3xl border border-border bg-card p-8 hover:border-primary/40 transition-all duration-500 shadow-sm flex flex-col justify-center group" data-animate>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Book Securely</h3>
              <p className="text-muted-foreground font-light leading-relaxed">Protected payments, clear cancellation policies, and 24/7 responsive host support.</p>
            </div>

            {/* Small Feature Card 2 */}
            <div className="rounded-3xl border border-border bg-card p-8 hover:border-primary/40 transition-all duration-500 shadow-sm flex flex-col justify-center group" data-animate>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Travel Responsibly</h3>
              <p className="text-muted-foreground font-light leading-relaxed">Your stay directly supports local livelihoods and promotes low-impact travel practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Photo Wall */}
      <section className="pt-20 pb-24 bg-transparent border-t border-border/50" data-bg="dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12" data-animate>
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-widest ring-1 ring-inset bg-emerald-500/10 text-emerald-500 ring-emerald-500/30 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                Community Stories
              </span>
              <h2 className="text-4xl md:text-5xl tracking-tight font-black text-foreground font-serif italic">The Homestead Diary</h2>
              <p className="mt-4 text-lg text-muted-foreground font-medium">Post your favorite moments from your trip or homestay. Tag #Homestead on social media and share them here to inspire others.</p>
            </div>
            <div className="shrink-0">
              <Link to="/share-photo" className="group rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest border border-border bg-card hover:border-primary transition-all flex items-center gap-3 text-foreground shadow-sm hover:shadow-xl hover:-translate-y-1">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                </span>
                Publish a Memory
              </Link>
            </div>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos.map((photo, index) => (
              <div key={photo._id || index} className="break-inside-avoid">
                <PhotoCard photo={photo} onDelete={handleDeletePhoto} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host CTA */}
      <section data-bg="dark" className="overflow-hidden border-y border-border/50 pt-24 pb-32 relative bg-transparent" id="host">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background:radial-gradient(800px_400px_at_50%_-30%,hsl(var(--primary)),transparent_60%)]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div data-animate className="flex flex-col items-start text-left space-y-8">
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-widest ring-1 ring-inset bg-amber-500/10 text-amber-500 ring-amber-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"></path><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"></path><path d="m21 3 1 11h-2"></path><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"></path><path d="M3 4h8"></path></svg>
                Host with Homestead
              </span>
              
              <h3 className="text-4xl md:text-5xl tracking-tight font-black text-foreground font-serif italic">Share your space, empower your community.</h3>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed font-light">List your homestay with transparent terms, fair payouts, and dedicated guidance on running an eco-friendly operation.</p>
              
              <div className="grid grid-cols-1 gap-4 w-full max-w-xl">
                {[
                  { title: "Zero-cost onboarding", desc: "Free listing creation and professional photography guidance.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg> },
                  { title: "Smart management", desc: "Intuitive tools to manage bookings, dynamic pricing, and your calendar.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg> },
                  { title: "Sustainability first", desc: "Access our green playbook and earn eco-certification badges.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg> }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-3xl bg-card border border-border hover:border-primary/40 transition-colors shadow-sm">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-background border border-border shadow-inner flex items-center justify-center text-primary">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/signup" className="group rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-widest border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg>
                  Become a host
                </Link>
              </div>
            </div>

            <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto" data-animate>
              <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl -z-10"></div>
              {featuredProperty ? (
                <div className="relative">
                  <div className="overflow-hidden rounded-[2.5rem] border border-border shadow-2xl bg-card">
                    <img src={getImageUrl(featuredProperty.images[0])} alt={featuredProperty.name} className="h-96 w-full object-cover" />
                  </div>
                  <div className="absolute -bottom-8 -left-4 sm:-left-8 bg-card/80 backdrop-blur-xl border-border border rounded-3xl p-5 shadow-2xl w-[90%] max-w-[320px]">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-[1rem] border border-border shadow-inner flex-shrink-0">
                        <img 
                          src={getImageUrl(featuredProperty.hostId.avatar)} 
                          alt={`${featuredProperty.hostId.name}'s avatar`} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-base font-black text-foreground truncate tracking-tight">
                          {featuredProperty.hostId.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Host since {new Date(featuredProperty.hostId.createdAt).getFullYear()}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-black bg-primary/10 text-primary px-3 py-1.5 rounded-xl border border-primary/20 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                        {featuredProperty.averageRating > 0 ? featuredProperty.averageRating.toFixed(1) : 'New'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="overflow-hidden rounded-[2.5rem] border border-border shadow-2xl bg-card">
                    <img src="https://images.unsplash.com/photo-1600585153490-76fb20a32601?q=80&w=1600&auto=format&fit=crop" alt="Host property" className="h-96 w-full object-cover" />
                  </div>
                  <div className="absolute -bottom-8 -left-4 sm:-left-8 bg-card/80 backdrop-blur-xl border-border border rounded-3xl p-5 shadow-2xl w-[90%] max-w-[320px]">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-[1rem] border border-border shadow-inner flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80" 
                          alt="Default Host avatar" 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-base font-black text-foreground truncate tracking-tight">
                          Priya • Host
                        </p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Since 2021</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-black bg-primary/10 text-primary px-3 py-1.5 rounded-xl border border-primary/20 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                        4.9
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
