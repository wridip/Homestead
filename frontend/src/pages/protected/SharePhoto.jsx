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
    <div className="container mx-auto px-4 py-8 bg-transparent">
      <h1 className="text-3xl font-bold mb-4 text-neutral-200">Share Your Photo</h1>
      {error && <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      {success && <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-[#1E1E1E] rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="photo" className="block text-sm font-medium text-neutral-400">
            Photo
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="mt-1 block w-full bg-transparent border border-neutral-700 rounded-md text-white"
          />
        </div>
        {preview && (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="max-w-full h-auto" />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-neutral-400">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md bg-transparent border border-neutral-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="socialLink" className="block text-sm font-medium text-neutral-400">
            Social Media Link
          </label>
          <input
            type="url"
            id="socialLink"
            value={socialLink}
            onChange={(e) => setSocialLink(e.target.value)}
            className="mt-1 block w-full rounded-md bg-transparent border border-neutral-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default SharePhoto;