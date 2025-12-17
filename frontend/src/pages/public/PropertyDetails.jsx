import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById } from '../../services/propertyService';
import { getReviewsForProperty, createReview } from '../../services/reviewService';
import { createBooking } from '../../services/bookingService';
import AuthContext from '../../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import { libraries } from '../../config/googleMaps.js';



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



  const { isLoaded } = useJsApiLoader({

    id: 'google-map-script',

    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,

    libraries

  });

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  const center = {
    lat: property.location.coordinates[1],
    lng: property.location.coordinates[0]
  };

  const nights = startDate && endDate ? (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) : 0;
  const totalPrice = nights > 0 ? nights * property.baseRate : 0;

  return (
    <div className="container mx-auto px-6 py-12 p-8 bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-neutral-800">
      <h1 className="text-3xl font-bold text-neutral-200">{property.name}</h1>
      <p className="text-neutral-400">{property.address}</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={property.images && property.images.length > 0 ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${property.images[0]}` : 'https://via.placeholder.com/300'} alt={property.name} className="w-full object-cover rounded-lg shadow-md" />
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-neutral-200">About this property</h2>
            <p className="text-neutral-400 mt-4">{property.description}</p>
          </div>
        </div>

        <div>
          <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-neutral-200">Book your stay</h2>
            <div className="mt-4">
              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start);
                  setEndDate(end);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
              />
            </div>
            {nights > 0 && (
              <div className="mt-4 text-lg text-neutral-200">
                <p>Total nights: {nights}</p>
                <p>Total price: ₹{totalPrice.toFixed(2)}</p>
              </div>
            )}
            <button onClick={handleBooking} className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
              Book Now
            </button>
            {bookingError && <p className="text-red-400 mt-2">{bookingError}</p>}
            {bookingSuccess && <p className="text-green-400 mt-2">Booking successful!</p>}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-neutral-200">Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review._id} className="bg-[#1E1E1E] p-4 rounded-lg shadow-md mt-4">
              <p className="font-bold text-neutral-200">{review.userId.name}</p>
              <p className="text-neutral-200">Rating: {review.rating}/5</p>
              <p className="text-neutral-200">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-neutral-200">No reviews yet.</p>
        )}

        {isAuthenticated && user.role === 'Traveler' && (
          <form onSubmit={handleReviewSubmit} className="mt-8 bg-[#1E1E1E] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-neutral-200">Leave a Review</h3>
            <div className="mt-4">
              <label htmlFor="rating" className="block text-sm font-medium text-neutral-400">Rating</label>
              <select
                id="rating"
                name="rating"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-neutral-900/50 text-neutral-200"
              >
                <option value="0">Select a rating</option>
                <option value="1">1 - Terrible</option>
                <option value="2">2 - Poor</option>
                <option value="3">3 - Average</option>
                <option value="4">4 - Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <div className="mt-4">
              <label htmlFor="comment" className="block text-sm font-medium text-neutral-400">Comment</label>
              <textarea
                id="comment"
                name="comment"
                rows="3"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-neutral-800 rounded-md bg-neutral-900/50 text-neutral-200"
              ></textarea>
            </div>
            <button type="submit" className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
              Submit Review
            </button>
            {reviewError && <p className="text-red-400 mt-2">{reviewError}</p>}
          </form>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-neutral-200">Location</h2>
        <div className="mt-4">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '450px' }}
              center={center}
              zoom={15}
            >
              <Marker position={center} />
            </GoogleMap>
          ) : (
            <div className="text-neutral-200">Loading Map...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;