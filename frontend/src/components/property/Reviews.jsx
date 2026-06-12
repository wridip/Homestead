import React from 'react';

const Reviews = ({ reviews }) => (
  <div>
    <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
      Reviews
    </h2>
    {reviews.length > 0 ? (
      reviews.map((review) => (
        <div key={review._id} className="bg-card p-4 rounded-lg shadow-md mt-4">
          <div className="flex items-center mb-2">
            <p className="font-bold text-foreground">{review.userId.name}</p>
            <p className="text-muted-foreground ml-auto">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
          <p className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
          <p className="text-muted-foreground mt-2">{review.comment}</p>
        </div>
      ))
    ) : (
      <p className="text-muted-foreground mt-4">No reviews yet.</p>
    )}
  </div>
);

export default Reviews;
