import React from 'react';

const ReviewForm = ({
  isAuthenticated,
  user,
  handleReviewSubmit,
  newReview,
  setNewReview,
  reviewError,
}) => (
  isAuthenticated && user.role === 'Traveler' && (
    <div className="mt-8 md:col-span-2">
      <form onSubmit={handleReviewSubmit} className="bg-card p-6 rounded-lg shadow-md border border-border">
        <h3 className="text-xl font-semibold text-foreground">Leave a Review</h3>
        <div className="mt-4">
          <label htmlFor="rating" className="block text-sm font-medium text-muted-foreground">
            Rating
          </label>
          <select
            id="rating"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-border focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-background text-foreground"
          >
            <option value="0" className="bg-card text-foreground">Select a rating</option>
            {[1, 2, 3, 4, 5].map(r => <option key={r} value={r} className="bg-card text-foreground">{r} - {'★'.repeat(r)}</option>)}
          </select>
        </div>
        <div className="mt-4">
          <label htmlFor="comment" className="block text-sm font-medium text-muted-foreground">
            Comment
          </label>
          <textarea
            id="comment"
            rows="4"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="shadow-sm focus:ring-primary focus:border-primary mt-1 block w-full sm:text-sm border border-border rounded-md bg-background text-foreground placeholder-muted-foreground"
          ></textarea>
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition duration-300 font-semibold"
        >
          Submit Review
        </button>
        {reviewError && <p className="text-red-400 mt-2">{reviewError}</p>}
      </form>
    </div>
  )
);

export default ReviewForm;
