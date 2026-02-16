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
      <form onSubmit={handleReviewSubmit} className="bg-[#1E1E1E] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-neutral-200">Leave a Review</h3>
        <div className="mt-4">
          <label htmlFor="rating" className="block text-sm font-medium text-neutral-400">
            Rating
          </label>
          <select
            id="rating"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-neutral-900 text-neutral-200"
          >
            <option value="0">Select a rating</option>
            {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} - {'★'.repeat(r)}</option>)}
          </select>
        </div>
        <div className="mt-4">
          <label htmlFor="comment" className="block text-sm font-medium text-neutral-400">
            Comment
          </label>
          <textarea
            id="comment"
            rows="4"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-neutral-700 rounded-md bg-neutral-900 text-neutral-200"
          ></textarea>
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          Submit Review
        </button>
        {reviewError && <p className="text-red-400 mt-2">{reviewError}</p>}
      </form>
    </div>
  )
);

export default ReviewForm;
