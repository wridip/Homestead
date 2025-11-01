import React from 'react';

const PhotoCard = ({ photo }) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] hover:border-white/20" data-animate>
      <img src={photo.imageUrl} alt={photo.alt} className="h-44 w-full object-cover" />
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-white/10 text-[#D1D0D0]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"></path></svg>
            {photo.user}
          </span>
          <span className="ml-1 text-xs text-[#D1D0D0]/60">{photo.tag}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-[#D1D0D0]/80">{photo.caption}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 text-xs text-[#D1D0D0]">
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#5C4E4E]"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>
              {photo.likes}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path></svg>
              {photo.comments}
            </span>
          </div>
          <button className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium hover:border-white/20 transition inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>
            Share
          </button>
        </div>
      </div>
    </article>
  );
};

export default PhotoCard;
