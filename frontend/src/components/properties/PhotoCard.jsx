import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const PhotoCard = ({ photo, onDelete }) => {
  const { user } = useContext(AuthContext);

  const handleShare = () => {
    // TODO: Implement photo sharing logic
    console.log('Sharing photo:', photo);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      onDelete(photo._id);
    }
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#1E1E1E] hover:border-[rgba(255,255,255,0.2)]" data-animate>
      <img src={`http://localhost:5000/${photo.imageUrl.replace(/\\/g, '/')}`} alt={photo.caption} className="h-44 w-full object-cover" />
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-[rgba(255,255,255,0.1)] text-[#E0E0E0]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"></path></svg>
            {photo.user.name}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-[#E0E0E0]/80">{photo.caption}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 text-xs text-[#E0E0E0]">
            {/* Likes and comments can be added later */}
          </div>
          <div className="flex items-center gap-2">
            {user && user.role === 'Host' && (
              <button onClick={handleDelete} className="rounded-md border border-[rgba(255,255,255,0.1)] px-3 py-1.5 text-xs font-medium hover:border-[rgba(255,255,255,0.2)] transition inline-flex items-center text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                Delete
              </button>
            )}
            {user && user.role === 'Host' && (
              <button onClick={handleShare} className="rounded-md border border-[rgba(255,255,255,0.1)] px-3 py-1.5 text-xs font-medium hover:border-[rgba(255,255,255,0.2)] transition inline-flex items-center text-[#E0E0E0]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>
                Share
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export { PhotoCard };
