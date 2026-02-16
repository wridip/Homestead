import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById } from '../../services/propertyService';
import { getReviewsForProperty, createReview } from '../../services/reviewService';
import { createBooking } from '../../services/bookingService';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [reviewError, setReviewError] = useState(null);

  const { isLoaded } = useGoogleMapsLoader();

  const fetchPropertyAndReviews = async () => {
    try {
      const [propertyResponse, reviewsResponse] = await Promise.all([
        getPropertyById(id),
        getReviewsForProperty(id),
      ]);
      setProperty(propertyResponse.data);
      setReviews(reviewsResponse.data);
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
      <PropertyHeader name={property.name} address={property.address} />
      <PhotoGallery images={property.images} propertyName={property.name} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <PropertyInfo description={property.description} amenities={property.amenities} />
          <Reviews reviews={reviews} />
        </div>

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