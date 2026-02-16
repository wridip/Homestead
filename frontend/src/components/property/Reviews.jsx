import React from 'react';

const Reviews = ({ reviews }) => (
  <div>
    <h2 className="text-2xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2">
      Reviews
    </h2>
    {reviews.length > 0 ? (
      reviews.map((review) => (
        <div key={review._id} className="bg-[#1E1E1E] p-4 rounded-lg shadow-md mt-4">
          <div className="flex items-center mb-2">
            <p className="font-bold text-neutral-200">{review.userId.name}</p>
            <p className="text-neutral-400 ml-auto">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
          <p className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
          <p className="text-neutral-300 mt-2">{review.comment}</p>
        </div>
      ))
    ) : (
      <p className="text-neutral-400 mt-4">No reviews yet.</p>
    )}
  </div>
);

export default Reviews;
