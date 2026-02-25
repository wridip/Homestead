import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById } from '../../services/propertyService';
import { getReviewsForProperty, createReview } from '../../services/reviewService';
import { createBooking } from '../../services/bookingService';
import { sendMessage } from '../../services/messageService';
import { getUserProfile } from '../../services/userService';
import AuthContext from '../../context/AuthContext';
import { useGoogleMapsLoader } from '../../context/GoogleMapsLoaderContext';
import PropertyHeader from '../../components/property/PropertyHeader';
import PhotoGallery from '../../components/property/PhotoGallery';
import PropertyInfo from '../../components/property/PropertyInfo';
import BookingCard from '../../components/property/BookingCard';
import Reviews from '../../components/property/Reviews';
import ReviewForm from '../../components/property/ReviewForm';
import LocationMap from '../../components/property/LocationMap';

const PropertyDetails = () => {
  const { id } = useParams();
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

  const { isLoaded } = useGoogleMapsLoader();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      return setMessageError('You must be logged in to send a message.');
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

    const bookingData = {
      propertyId: property._id,
      startDate,
      endDate,
      totalPrice: (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) * property.baseRate,
    };

    try {
      await createBooking(bookingData);
      setBookingSuccess(true);
      setBookingError(null);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'An error occurred while booking.');
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
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  if (!property) {
    return <div className="text-center p-8">Property not found</div>;
  }

  const center = {
    lat: property.location.coordinates[1],
    lng: property.location.coordinates[0],
  };

  const nights = startDate && endDate ? (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) : 0;
  const totalPrice = nights > 0 ? nights * property.baseRate : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertyHeader 
        name={property.name} 
        address={property.address} 
        rating={property.averageRating}
        reviewsCount={property.numReviews}
      />
      <PhotoGallery images={property.images} propertyName={property.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PropertyInfo description={property.description} amenities={property.amenities} />
          
          {/* Professional Host Section */}
          {host && (
            <div className="mt-12 mb-8 p-8 bg-neutral-900 rounded-3xl border border-white/10 shadow-xl transition-all hover:border-[#BB86FC]/30">
              <h2 className="text-2xl font-bold text-white mb-6 italic">Meet your Host</h2>
              <div className="flex items-center gap-6">
                <Link to={`/host/${host._id}`} className="group relative">
                  <img
                    src={host.avatar ? `http://localhost:5000/uploads/${host.avatar}` : 'https://via.placeholder.com/150'}
                    alt={host.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#121212] shadow-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#BB86FC] rounded-full p-1.5 border-4 border-[#121212]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </Link>
                <div>
                  <Link to={`/host/${host._id}`} className="text-xl font-bold text-white hover:text-[#BB86FC] transition-colors">
                    {host.name}
                  </Link>
                  <p className="text-neutral-400 text-sm mt-1">Host since {new Date(host.createdAt).getFullYear()}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#BB86FC" stroke="#BB86FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <span className="text-sm font-semibold text-white">{property.averageRating > 0 ? property.averageRating.toFixed(1) : 'New'}</span>
                      {property.numReviews > 0 && (
                        <>
                          <span className="text-sm text-neutral-500 underline ml-1">{property.numReviews} Reviews</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-neutral-300 line-clamp-3 italic">
                {host.bio || "Hi, I'm " + host.name.split(' ')[0] + "! I love hosting travelers and sharing the beauty of our homestay. Looking forward to meeting you!"}
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to={`/host/${host._id}#message-section`}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl border border-white/10 transition-all shadow-lg"
                >
                  Contact Host
                </Link>
                <Link
                  to={`/host/${host._id}`}
                  className="px-6 py-2.5 bg-[#BB86FC]/10 hover:bg-[#BB86FC]/20 text-[#BB86FC] text-sm font-bold rounded-xl border border-[#BB86FC]/20 transition-all"
                >
                  View Profile
                </Link>
              </div>
            </div>
          )}

          <Reviews reviews={reviews} />
        </div>

        <div className="space-y-6">
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
        </div>
      </div>

      <ReviewForm
        isAuthenticated={isAuthenticated}
        user={user}
        handleReviewSubmit={handleReviewSubmit}
        newReview={newReview}
        setNewReview={setNewReview}
        reviewError={reviewError}
      />

      <LocationMap center={center} isLoaded={isLoaded} />
    </div>
  );
};

export default PropertyDetails;