import React, { useState } from 'react';
import { uploadPhoto } from '../../services/photoService';

const SharePhoto = () => {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
    formData.append('caption', name); // Using name as caption for now
    formData.append('socialLink', socialLink);
    // TODO: Replace with actual property ID
    formData.append('property', '60d5f1b3e6b3f10015f1b3e6'); 

    try {
      await uploadPhoto(formData);
      setSuccess('Photo uploaded successfully!');
      setPhoto(null);
      setPreview(null);
      setName('');
      setSocialLink('');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="p-8 bg-background rounded-2xl shadow-lg backdrop-blur-sm border border-border">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Share Your Photo</h1>
      {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      {success && <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-card rounded-xl border border-border shadow-md">
        <div className="mb-6">
          <label htmlFor="photo" className="block text-sm font-medium text-muted-foreground mb-2">
            Photo
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
          />
        </div>
        {preview && (
          <div className="mb-6">
            <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg border border-border shadow-sm" />
          </div>
        )}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md bg-transparent border border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-foreground p-3"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="socialLink" className="block text-sm font-medium text-muted-foreground mb-2">
            Social Media Link
          </label>
          <input
            type="url"
            id="socialLink"
            value={socialLink}
            onChange={(e) => setSocialLink(e.target.value)}
            className="mt-1 block w-full rounded-md bg-transparent border border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-foreground p-3"
            placeholder="https://instagram.com/..."
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-md font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          Upload Photo
        </button>
      </form>
    </div>
  );
};

export default SharePhoto;