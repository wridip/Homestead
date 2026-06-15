import React from 'react';
import { getImageUrl } from '../../services/api';

const Reviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-12 py-12 border-t border-border text-center">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <h3 className="text-xl font-serif text-foreground italic">No reviews yet</h3>
        <p className="text-muted-foreground mt-2 text-sm">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-12 border-t border-border">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold text-foreground italic">Guest Reviews</h2>
        <span className="text-muted-foreground font-serif">·</span>
        <span className="text-foreground font-bold">{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {reviews.map((review) => (
          <div key={review._id} className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={review.userId?.avatar ? getImageUrl(review.userId.avatar) : getImageUrl('default-avatar.png')}
                alt={review.userId?.name || 'User'}
                className="w-12 h-12 rounded-full object-cover border border-border shadow-sm"
              />
              <div>
                <h4 className="text-sm font-bold text-foreground">{review.userId?.name || 'Anonymous Guest'}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill={i < review.rating ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                        className={i < review.rating ? 'text-primary' : 'text-muted/30'}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <span>·</span>
                  <span>{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm italic">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
