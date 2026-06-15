import React, { useState, useRef } from 'react';
import { uploadPhoto } from '../../services/photoService';
import { Link } from 'react-router-dom';

const SharePhoto = () => {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handlePhotoChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!photo) {
      setError('Please select a photo to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('caption', caption); 
    formData.append('socialLink', socialLink);
    // TODO: Replace with actual property selection if needed
    formData.append('property', '60d5f1b3e6b3f10015f1b3e6'); 

    try {
      await uploadPhoto(formData);
      setSuccess('Your memory has been published to the Homestead Diary!');
      setPhoto(null);
      setPreview(null);
      setCaption('');
      setSocialLink('');
    } catch (err) {
      setError(err.message || 'Something went wrong while publishing.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center">
      <div className="mb-12" data-animate>
        <Link to="/#community" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"/></svg>
          Back to Home
        </Link>
        <h1 className="text-5xl md:text-6xl font-black text-foreground font-serif italic tracking-tight mb-4">Publish a Memory</h1>
        <p className="text-lg text-muted-foreground max-w-2xl font-light">Share your offbeat discoveries with the Homestead community. Your stories inspire others to travel with purpose.</p>
      </div>

      <div className="bg-card rounded-[3rem] border border-border shadow-2xl overflow-hidden flex flex-col lg:flex-row" data-animate>
        
        {/* Left Side: Upload Zone / Preview */}
        <div className="w-full lg:w-1/2 bg-muted/30 p-8 lg:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border relative">
          {preview ? (
            <div className="relative group rounded-[2rem] overflow-hidden shadow-xl w-full max-w-md mx-auto aspect-[4/5] bg-card">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button 
                  type="button"
                  onClick={() => { setPhoto(null); setPreview(null); }}
                  className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/20 hover:scale-105 transition-all shadow-xl backdrop-blur-md"
                >
                  Choose Different Photo
                </button>
              </div>
            </div>
          ) : (
            <div 
              className={`border-2 border-dashed rounded-[2.5rem] w-full max-w-md mx-auto aspect-[4/5] flex flex-col items-center justify-center p-8 text-center transition-all duration-300 bg-card ${isDragging ? 'border-primary bg-primary/5 scale-105 shadow-xl' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-20 h-20 bg-background shadow-inner border border-border rounded-full flex items-center justify-center text-muted-foreground mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
              </div>
              <h3 className="text-xl font-black text-foreground mb-2">Drag & Drop Image</h3>
              <p className="text-sm text-muted-foreground mb-6 font-medium">Supports JPG, PNG, WEBP</p>
              
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-background border border-border text-foreground px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-muted transition-all shadow-sm"
              >
                Browse Files
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 lg:px-16 flex flex-col justify-center bg-card">
          
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary border border-primary/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Draft Entry
            </span>
            <h2 className="text-3xl font-black text-foreground tracking-tight">Story Details</h2>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-2xl flex items-start gap-3 mb-8 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-6 py-4 rounded-2xl flex items-start gap-3 mb-8 text-sm font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="caption" className="block text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                Your Story
              </label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="block w-full rounded-[1.5rem] bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 text-foreground p-5 resize-none transition-all placeholder:text-muted-foreground/50 font-medium"
                placeholder="Tell us about this hidden gem, the locals you met, or the peace you found..."
              ></textarea>
            </div>
            
            <div className="space-y-3">
              <label htmlFor="socialLink" className="block text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                Social Connection <span className="text-muted-foreground/50 lowercase tracking-normal font-medium">(Optional)</span>
              </label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <input
                  type="url"
                  id="socialLink"
                  value={socialLink}
                  onChange={(e) => setSocialLink(e.target.value)}
                  className="block w-full rounded-[1.5rem] bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 text-foreground p-5 pl-14 transition-all placeholder:text-muted-foreground/50 font-medium"
                  placeholder="Link to your Instagram, X, or blog post"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl shadow-xl shadow-primary/20 text-sm font-black uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 hover:-translate-y-1 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                Publish to Diary
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SharePhoto;