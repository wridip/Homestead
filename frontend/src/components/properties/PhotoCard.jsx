import React, { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import ShareModal from '../common/ShareModal';
import { getImageUrl } from '../../services/api';

const PhotoCard = ({ photo, onDelete }) => {
  const { user } = useContext(AuthContext);
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Homestead Photo',
      text: photo.caption,
      url: window.location.href, // Or a more specific URL if available
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Photo shared successfully');
      } catch (error) {
        console.error('Error sharing photo:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      setShareModalOpen(true);
    }
  };

  const handleSocialClick = (platform) => {
    // In a real app, this would use photo.user.socialLinks or similar
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this amazing photo by ${photo.user.name} on Homestead! ${photo.caption}`);
    
    let shareUrl = '';
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL, usually link to profile or fallback
        shareUrl = `https://instagram.com`;
        break;
      default:
        break;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      onDelete(photo._id);
    }
  };

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-[2rem] border border-border bg-card hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-xl" data-animate>
        <div className="relative overflow-hidden aspect-[4/5] sm:aspect-auto sm:h-72">
          <img 
            src={getImageUrl(photo.imageUrl)} 
            alt={photo.caption} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          {/* Hover Overlay with Social Links */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-4 backdrop-blur-[2px]">
            {photo.socialLink ? (
              <>
                <p className="text-white font-black uppercase tracking-widest text-xs">Connect with Creator</p>
                <a 
                  href={photo.socialLink.startsWith('http') ? photo.socialLink : `https://${photo.socialLink}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-white/10 text-white flex items-center justify-center gap-2 hover:bg-primary hover:border-primary border border-white/20 transition-all backdrop-blur-md font-bold text-sm shadow-xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  Visit Profile
                </a>
              </>
            ) : (
              <>
                <p className="text-white font-black uppercase tracking-widest text-xs">Share this memory</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleSocialClick('twitter')} className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#1DA1F2] hover:scale-110 transition-all backdrop-blur-md border border-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 0.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </button>
                  <button onClick={() => handleSocialClick('facebook')} className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#1877F2] hover:scale-110 transition-all backdrop-blur-md border border-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-black uppercase text-xs border border-primary/20 shrink-0">
              {photo.user.name.charAt(0)}
            </span>
            <span className="font-bold text-foreground tracking-tight line-clamp-1">
              {photo.user.name}
            </span>
          </div>
          <p className="mt-4 line-clamp-3 text-sm text-muted-foreground font-medium leading-relaxed">{photo.caption}</p>
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <button onClick={handleShare} className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>
              Share Post
            </button>
            
            <div className="flex items-center gap-2 shrink-0">
              {user && (user._id === photo.user._id || user.role === 'Admin') && (
                <button onClick={handleDelete} className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-colors" title="Delete Photo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
      {isShareModalOpen && (
        <ShareModal
          url={window.location.href}
          text={photo.caption}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </>
  );
};

export { PhotoCard };
