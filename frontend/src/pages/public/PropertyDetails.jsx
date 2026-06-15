import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getPropertyById } from '../../services/propertyService';
import { getReviewsForProperty, createReview } from '../../services/reviewService';
import { createBooking, verifyPayment } from '../../services/bookingService';
import { sendMessage } from '../../services/messageService';
import { getUserProfile } from '../../services/userService';
import AuthContext from '../../context/AuthContext';
import { useGoogleMapsLoader } from '../../context/GoogleMapsLoaderContext';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyHeader from '../../components/property/PropertyHeader';
import PhotoGallery from '../../components/property/PhotoGallery';
import PropertyInfo from '../../components/property/PropertyInfo';
import BookingCard from '../../components/property/BookingCard';
import Reviews from '../../components/property/Reviews';
import ReviewForm from '../../components/property/ReviewForm';
import LocationMap from '../../components/property/LocationMap';
import PropertyDetailsSkeleton from '../../components/property/PropertyDetailsSkeleton';
import { getImageUrl } from '../../services/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [reviewError, setReviewError] = useState(null);

  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState(null);
  const [messageSuccess, setMessageSuccess] = useState(false);

  const { isLoaded, loadError } = useGoogleMapsLoader();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (user.role !== 'Traveler') {
      return setMessageError('Only travelers can send messages to hosts.');
    }
    if (!message.trim()) {
      return setMessageError('Please enter a message.');
    }

    try {
      await sendMessage({
        receiverId: property.hostId,
        propertyId: property._id,
        subject: `Query about ${property.name}`,
        content: message,
      });
      setMessageSuccess(true);
      setMessage('');
      setMessageError(null);
    } catch (err) {
      setMessageError(err.response?.data?.message || 'Failed to send message.');
    }
  };

  const fetchPropertyAndReviews = async () => {
    try {
      const [propertyResponse, reviewsResponse] = await Promise.all([
        getPropertyById(id),
        getReviewsForProperty(id),
      ]);
      setProperty(propertyResponse.data);
      setReviews(reviewsResponse.data);

      // Fetch host details
      const hostResponse = await getUserProfile(propertyResponse.data.hostId);
      setHost(hostResponse.data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPropertyAndReviews();
  }, [id]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      return setBookingError('You must be logged in to book a property.');
    }

    if (user.role !== 'Traveler') {
      return setBookingError('Only travelers can book properties.');
    }

    if (!startDate || !endDate) {
      return setBookingError('Please select a start and end date.');
    }

    const res = await loadRazorpay();

    if (!res) {
      return setBookingError('Razorpay SDK failed to load. Are you online?');
    }

    const bookingData = {
      propertyId: property._id,
      startDate,
      endDate,
    };

    try {
      const result = await createBooking(bookingData);
      const { razorpayOrder, data: booking } = result;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Homestead',
        description: `Booking for ${property.name}`,
        image: getImageUrl('favicon.ico'),
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setBookingSuccess(true);
            setBookingError(null);
          } catch (err) {
            setBookingError(err.response?.data?.message || 'Payment verification failed.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        notes: {
          address: property.address,
        },
        theme: {
          color: '#437354',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function (response) {
        setBookingError(response.error.description);
      });

    } catch (err) {
      setBookingError(err.response?.data?.message || 'An error occurred while initiating booking.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || user.role !== 'Traveler') {
      return setReviewError('You must be logged in as a traveler to submit a review.');
    }

    try {
      await createReview(id, newReview);
      setNewReview({ rating: 0, comment: '' });
      fetchPropertyAndReviews(); // Refresh reviews
    } catch (err) {
      setReviewError(err.response?.data?.message || 'An error occurred while submitting the review.');
    }
  };

  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  if (!property) {
    return <div className="text-center p-8">Property not found</div>;
  }

  const center = property?.location?.coordinates?.length === 2 ? {
    lat: property.location.coordinates[1],
    lng: property.location.coordinates[0],
  } : { lat: 0, lng: 0 };

  const nights = startDate && endDate ? (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) : 0;
  const totalPrice = nights > 0 ? nights * property.baseRate : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PropertyHeader 
          name={property.name} 
          address={property.address} 
          rating={property.averageRating}
          reviewsCount={property.numReviews}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <PhotoGallery images={property.images} propertyName={property.name} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <PropertyInfo description={property.description} amenities={property.amenities} />
          </motion.div>
          
          {/* Professional Host Section */}
          {host && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mt-12 mb-8 p-8 bg-card rounded-3xl border border-border shadow-xl transition-all hover:border-primary/30 relative overflow-hidden group"
            >
              {/* Subtle background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
              
              <h2 className="text-2xl font-bold text-foreground mb-6 italic">Meet your Host</h2>
              <div className="flex items-center gap-6 relative z-10">
                <Link to={`/host/${host._id}`} className="group relative">
                  <img
                    src={host.avatar ? getImageUrl(host.avatar) : getImageUrl('default-avatar.png')}
                    alt={host.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 border-4 border-background">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </Link>
                <div>
                  <Link to={`/host/${host._id}`} className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                    {host.name}
                  </Link>
                  <p className="text-muted-foreground text-sm mt-1">Host since {new Date(host.createdAt).getFullYear()}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <span className="text-sm font-semibold text-foreground">{property.averageRating > 0 ? property.averageRating.toFixed(1) : 'New'}</span>
                      {property.numReviews > 0 && (
                        <>
                          <span className="text-sm text-muted-foreground underline ml-1">{property.numReviews} Reviews</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-muted-foreground line-clamp-3 italic relative z-10">
                {host.bio || "Hi, I'm " + host.name.split(' ')[0] + "! I love hosting travelers and sharing the beauty of our homestay. Looking forward to meeting you!"}
              </div>
              <div className="mt-6 flex flex-wrap gap-4 relative z-10">
                <Link
                  to={`/host/${host._id}#message-section`}
                  className="px-6 py-2.5 bg-accent/20 hover:bg-accent/40 text-foreground text-sm font-bold rounded-xl border border-border transition-all shadow-lg active:scale-95"
                >
                  Contact Host
                </Link>
                <Link
                  to={`/host/${host._id}`}
                  className="px-6 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold rounded-xl border border-primary/20 transition-all active:scale-95"
                >
                  View Profile
                </Link>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Reviews reviews={reviews} />
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <BookingCard
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              nights={nights}
              property={property}
              totalPrice={totalPrice}
              handleBooking={handleBooking}
              bookingError={bookingError}
              bookingSuccess={bookingSuccess}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <ReviewForm
          isAuthenticated={isAuthenticated}
          user={user}
          handleReviewSubmit={handleReviewSubmit}
          newReview={newReview}
          setNewReview={setNewReview}
          reviewError={reviewError}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <LocationMap center={center} isLoaded={isLoaded} loadError={loadError} />
      </motion.div>
    </div>
  );
};

export default PropertyDetails;